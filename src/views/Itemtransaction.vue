
<template>
  <v-row no-gutters>
    <v-col cols="12" md="12">
      <v-row no-gutters align="center">
        <v-col cols="3" md="3" class="px-2">
          <v-text-field
            label="Product Name"
            v-model="searchProduct"
            @update:model-value="filterItemtransactionMethod()"
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="2" md="2" class="px-2">
          <v-btn
            color="primary"
            @click="clickAddItemtransaction()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-table fixed-header height="69vh" density="compact">
        <thead>
          <tr>
            <th>No.</th>
            <th>Product Name</th>
            <th>Transaction Type</th>
            <th>Voucher Code</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in filterItemtransactionList"
            :key="item.itemTransactionId"
            :style="selectedOne.itemTransactionId === item.itemTransactionId
              ? 'background-color: #e3f2fd'
              : ''"
            @click="selectedOne = item"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ getProductName(item.productId) }}</td>

            <td>
              <span v-if="item.purchaseId != null">
                PURCHASE
              </span>
              <span v-else-if="item.saleId != null">
                SALE
              </span>
            </td>

            <td v-if="item.purchaseId != null">
              {{ getPurchaseVoucher(item.purchaseId) }}
            </td>
            <td v-else-if="item.saleId != null">
              {{ getSaleVoucher(item.saleId) }}
            </td>

            <td>{{ item.qty }}</td>
            <td>{{ item.unitPrice }}</td>
            <td>{{ item.amount }}</td>

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

      <v-dialog v-model="itemtransactionDialog" max-width="500px">
        <v-card>
          <v-card-title>
            {{ saveOrupdate }} Item Transaction
          </v-card-title>

          <v-card-text>
            <v-row>

              <v-col cols="12">
                <v-select
                  label="Product Name"
                  :items="productList"
                  item-title="productName"
                  item-value="productId"
                  v-model="itemtransaction.productId"
                  clearable
                ></v-select>
              </v-col>

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
                  v-model="itemtransaction.purchaseId"
                  clearable
                ></v-select>
              </v-col>

              <v-col cols="12" v-if="transactionType === 'SALE'">
                <v-select
                  label="Sale Voucher"
                  :items="saleList"
                  item-title="voucherCode"
                  item-value="saleId"
                  v-model="itemtransaction.saleId"
                  clearable
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Quantity"
                  type="number"
                  v-model.number="itemtransaction.qty"
                  @update:model-value="calculateAmount()"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Unit Price"
                  type="number"
                  v-model.number="itemtransaction.unitPrice"
                  @update:model-value="calculateAmount()"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Amount"
                  type="number"
                  v-model.number="itemtransaction.amount"
                  readonly
                ></v-text-field>
              </v-col>

            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="grey"
              @click="itemtransactionDialog = false"
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
            Delete Item Transaction
          </v-card-title>

          <v-card-text>
            Are you sure you want to delete this Item Transaction?
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
import itemtransactionService from "../service/ItemtransactionService.js";
import productService from "../service/ProductService.js";
import purchaseService from "../service/PurchaseService.js";
import saleService from "../service/SaleService.js";

export default {
  data() {
    return {
      selectedOne: {},

      itemtransactionList: [],
      filterItemtransactionList: [],

      productList: [],
      purchaseList: [],
      saleList: [],

      transactionTypeList: ["PURCHASE", "SALE"],
      transactionType: "SALE",

      searchProduct: "",

      itemtransactionDialog: false,
      deleteDialog: false,

      saveOrupdate: "SAVE",

      snackbar: false,
      snackbarText: "",

      itemtransaction: {
        itemTransactionId: null,
        productId: null,
        purchaseId: null,
        saleId: null,
        qty: 0,
        unitPrice: 0,
        amount: 0
      }
    };
  },

  mounted() {
    this.itemtransactionListMethod();
    this.productListMethod();
    this.purchaseListMethod();
    this.saleListMethod();
  },

  methods: {

    itemtransactionListMethod() {
      itemtransactionService.getItemtransaction().then((response) => {
        this.itemtransactionList = response;
        this.filterItemtransactionList = response;
      });
    },

    productListMethod() {
      productService.getProductList().then((response) => {
        this.productList = response;
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

    getProductName(productId) {
      let product = this.productList.find(
        (p) => p.productId === productId
      );

      if (product) {
        return product.productName;
      }

      return "";
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

    filterItemtransactionMethod() {
      this.filterItemtransactionList = this.itemtransactionList.filter((t) => {
        let productName = this.getProductName(t.productId);

        return (
          !this.searchProduct ||
          (productName &&
            productName.toLowerCase().includes(
              this.searchProduct.toLowerCase()
            ))
        );
      });
    },

    clickAddItemtransaction() {
      this.itemtransaction = {
        itemTransactionId: null,
        productId: null,
        purchaseId: null,
        saleId: null,
        qty: 0,
        unitPrice: 0,
        amount: 0
      };

      this.transactionType = "SALE";
      this.saveOrupdate = "SAVE";
      this.itemtransactionDialog = true;
    },

    clickEdit(item) {
      this.itemtransaction = Object.assign({}, item);

      if (item.purchaseId != null) {
        this.transactionType = "PURCHASE";
      }

      if (item.saleId != null) {
        this.transactionType = "SALE";
      }

      this.saveOrupdate = "UPDATE";
      this.itemtransactionDialog = true;
    },

    changeTransactionType() {
      this.itemtransaction.purchaseId = null;
      this.itemtransaction.saleId = null;
    },

    calculateAmount() {
      this.itemtransaction.amount =
        this.itemtransaction.qty * this.itemtransaction.unitPrice;
    },

    clickSaveOrUpdate() {

      if (this.itemtransaction.productId == null) {
        this.showSnackbar("Please select Product Name!");
        return;
      }

      if (this.transactionType === "PURCHASE") {
        if (this.itemtransaction.purchaseId == null) {
          this.showSnackbar("Please select Purchase Voucher!");
          return;
        }

        this.itemtransaction.saleId = null;
      }

      if (this.transactionType === "SALE") {
        if (this.itemtransaction.saleId == null) {
          this.showSnackbar("Please select Sale Voucher!");
          return;
        }

        this.itemtransaction.purchaseId = null;
      }

      if (this.itemtransaction.qty <= 0) {
        this.showSnackbar("Please enter Quantity!");
        return;
      }

      if (this.itemtransaction.unitPrice <= 0) {
        this.showSnackbar("Please enter Unit Price!");
        return;
      }

      this.calculateAmount();

      let request;

      if (this.saveOrupdate === "SAVE") {
        request = itemtransactionService.addItemtransaction(this.itemtransaction);
      } else {
        request = itemtransactionService.updateItemtransaction(this.itemtransaction);
      }

      request.then(() => {
        this.showSnackbar("Item Transaction saved successfully!");
        this.itemtransactionDialog = false;
        this.itemtransactionListMethod();
      }).catch((error) => {
        console.log("Item Transaction Error:", error);
        this.showSnackbar("Item Transaction save failed!");
      });
    },

    showDeleteDialog(item) {
      this.selectedOne = item;
      this.deleteDialog = true;
    },

    clickDeleteMethod() {
      itemtransactionService.deleteItemtransaction(
        this.selectedOne.itemTransactionId
      ).then(() => {
        this.showSnackbar("Item Transaction deleted successfully!");
        this.deleteDialog = false;
        this.itemtransactionListMethod();
      }).catch((error) => {
        console.log("Delete Error:", error);
        this.showSnackbar("Item Transaction delete failed!");
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
