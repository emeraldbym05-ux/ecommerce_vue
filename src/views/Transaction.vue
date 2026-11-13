
<template>
  <v-row no-gutters>
    <v-col cols="12" md="12">

      <v-row no-gutters align="center">
        <v-col cols="3" md="3" class="px-2">
          <v-text-field
            label="Bank Name"
            v-model="searchBank"
            @update:model-value="filterTransactionMethod()"
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="2" md="2" class="px-2">
          <v-btn
            color="primary"
            @click="clickAddTransaction()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-table fixed-header height="69vh" density="compact">
        <thead>
          <tr>
            <th>No.</th>
            <th>Transaction Type</th>
            <th>Purchase Voucher</th>
            <th>Sale Voucher</th>
            <th>Bank Name</th>
            <th>Payment</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in filterTransactionList"
            :key="item.transactionId"
            :style="selectedOne.transactionId === item.transactionId
              ? 'background-color: #e3f2fd'
              : ''"
            @click="selectedOne = item"
          >
            <td>{{ index + 1 }}</td>

           <td>
  <span v-if="item.purchaseId != null">
    PURCHASE
  </span>

  <span v-else-if="item.saleId != null">
    SALE
  </span>
</td>

            <td>{{ getPurchaseVoucher(item.purchaseId) }}</td>
            <td>{{ getSaleVoucher(item.saleId) }}</td>
            <td>{{ item.bankName }}</td>
            <td>{{ item.payment }}</td>

            <td>
              <v-icon
                color="primary"
                class="mr-2"
                @click.stop="clickEdit(item)"
              >
                mdi-pencil
              </v-icon>

              <v-icon
                color="red"
                @click.stop="showDeleteDialog(item)"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog v-model="transactionDialog" max-width="500px">
        <v-card>
          <v-card-title>
            {{ saveOrupdate }} Transaction
          </v-card-title>

          <v-card-text>
            <v-row>

              <v-col cols="12">
                <v-select
                  label="Transaction Type"
                  :items="transactionTypeList"
                  v-model="transactionType"
                  @update:model-value="changeTransactionType()"
                ></v-select>
              </v-col>

              <v-col cols="12" v-if="transactionType === 'PURCHASE'">
                <v-select
                  label="Purchase Voucher"
                  :items="purchaseList"
                  item-title="voucherCode"
                  item-value="purchaseId"
                  v-model="transaction.purchaseId"
                  clearable
                ></v-select>
              </v-col>

              <v-col cols="12" v-if="transactionType === 'SALE'">
                <v-select
                  label="Sale Voucher"
                  :items="saleList"
                  item-title="voucherCode"
                  item-value="saleId"
                  v-model="transaction.saleId"
                  clearable
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Bank Name"
                  v-model="transaction.bankName"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Payment"
                  type="number"
                  v-model.number="transaction.payment"
                ></v-text-field>
              </v-col>

            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="grey"
              @click="transactionDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              @click="clickSaveOrUpdate()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>
            Delete Transaction
          </v-card-title>

          <v-card-text>
            Are you sure you want to delete this Transaction?
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="grey"
              @click="deleteDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              color="red"
              @click="clickDeleteMethod()"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        color="success"
      >
        {{ snackbarText }}
      </v-snackbar>

    </v-col>
  </v-row>
</template>

<script>
import transactionService from "../service/TransactionService.js";
import purchaseService from "../service/PurchaseService.js";
import saleService from "../service/SaleService.js";

export default {
  data() {
    return {
      selectedOne: {},

      transactionList: [],
      filterTransactionList: [],

      purchaseList: [],
      saleList: [],

      transactionTypeList: ["PURCHASE", "SALE"],
      transactionType: "SALE",

      searchBank: "",

      transactionDialog: false,
      deleteDialog: false,

      saveOrupdate: "SAVE",

      snackbar: false,
      snackbarText: "",

      transaction: {
        transactionId: null,
        purchaseId: null,
        saleId: null,
        bankName: "",
        payment: 0
      }
    };
  },

  mounted() {
    this.transactionListMethod();
    this.purchaseListMethod();
    this.saleListMethod();
  },

  methods: {

    transactionListMethod() {
      transactionService.getTransactionList().then((response) => {
        this.transactionList = response;
        this.filterTransactionList = response;
      });
    },

    purchaseListMethod() {
      purchaseService.getPurchaseList().then((response) => {
        this.purchaseList = response;
      });
    },

    saleListMethod() {
      saleService.getSaleList().then((response) => {
        this.saleList = response;
      });
    },

    getPurchaseVoucher(purchaseId) {
      if (purchaseId == null) {
        return "";
      }

      let purchase = this.purchaseList.find(
        (p) => p.purchaseId === purchaseId
      );

      if (purchase) {
        return purchase.voucherCode;
      }

      return "";
    },

    getSaleVoucher(saleId) {
      if (saleId == null) {
        return "";
      }

      let sale = this.saleList.find(
        (s) => s.saleId === saleId
      );

      if (sale) {
        return sale.voucherCode;
      }

      return "";
    },

    filterTransactionMethod() {
      this.filterTransactionList = this.transactionList.filter((t) => {
        return (
          !this.searchBank ||
          (t.bankName &&
            t.bankName.toLowerCase().includes(
              this.searchBank.toLowerCase()
            ))
        );
      });
    },

    clickAddTransaction() {
      this.transaction = {
        transactionId: null,
        purchaseId: null,
        saleId: null,
        bankName: "",
        payment: 0
      };

      this.transactionType = "SALE";
      this.saveOrupdate = "SAVE";
      this.transactionDialog = true;
    },

    clickEdit(item) {
      this.transaction = Object.assign({}, item);

      if (item.purchaseId != null) {
        this.transactionType = "PURCHASE";
      }

      if (item.saleId != null) {
        this.transactionType = "SALE";
      }

      this.saveOrupdate = "UPDATE";
      this.transactionDialog = true;
    },

    changeTransactionType() {
      this.transaction.purchaseId = null;
      this.transaction.saleId = null;
    },

    clickSaveOrUpdate() {

      if (this.transactionType === "PURCHASE") {
        if (this.transaction.purchaseId == null) {
          this.showSnackbar("Please select Purchase Voucher!");
          return;
        }

        this.transaction.saleId = null;
      }

      if (this.transactionType === "SALE") {
        if (this.transaction.saleId == null) {
          this.showSnackbar("Please select Sale Voucher!");
          return;
        }

        this.transaction.purchaseId = null;
      }

      if (!this.transaction.bankName) {
        this.showSnackbar("Please enter Bank Name!");
        return;
      }

      if (this.transaction.payment <= 0) {
        this.showSnackbar("Please enter Payment!");
        return;
      }

      let request;

      if (this.saveOrupdate === "SAVE") {
        request = transactionService.addTransaction(this.transaction);
      } else {
        request = transactionService.updateTransaction(this.transaction);
      }

      request.then(() => {
        this.showSnackbar("Transaction saved successfully!");
        this.transactionDialog = false;
        this.transactionListMethod();
      }).catch((error) => {
        console.log("Transaction Error:", error);
        this.showSnackbar("Transaction save failed!");
      });
    },

    showDeleteDialog(item) {
      this.selectedOne = item;
      this.deleteDialog = true;
    },

    clickDeleteMethod() {
      transactionService.deleteTransaction(this.selectedOne).then(() => {
        this.showSnackbar("Transaction deleted successfully!");
        this.deleteDialog = false;
        this.transactionListMethod();
      }).catch((error) => {
        console.log("Delete Error:", error);
        this.showSnackbar("Transaction delete failed!");
      });
    },

    showSnackbar(message) {
      this.snackbarText = message;
      this.snackbar = true;
    }

  },

  watch: {},

  components: {}
};
</script>
