
<template>
  <v-row no-gutters>
    <v-col cols="12" md="12">

      <v-row no-gutters align="center">
        <v-col cols="3" md="3">
          <v-select
            label="Customer Name"
            :items="customerList"
            item-title="profileName"
            item-value="useraccountId"
            v-model="filterCustomerId"
            clearable
            @update:model-value="filterSaleMethod()"
          ></v-select>
        </v-col>

        <v-col cols="3" md="3" class="pl-2">
          <v-text-field
            label="Search Voucher Code"
            v-model="searchVoucher"
            clearable
            @update:model-value="filterSaleMethod()"
          />
        </v-col>

        <v-col cols="1" md="1">
          <v-icon
            color="green"
            class="pt-4 pl-2"
            @click="clickAddSale()"
          >
            mdi-plus-circle
          </v-icon>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" md="12">
          <v-table fixed-header height="69vh" density="compact">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center white--text bg-primary">
                    No.
                  </th>

                  <th class="text-center white--text bg-primary">
                    Voucher Code
                  </th>

                  <th class="text-center white--text bg-primary">
                    Customer Name
                  </th>

                  <th class="text-center white--text bg-primary">
                    Received Date
                  </th>

                  <th class="text-center white--text bg-primary">
                    Remark
                  </th>

                  <th class="text-center white--text bg-primary">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, index) in filterSaleList"
                  :key="item.saleId"
                  @click="selectedOne = item"
                  :style="{
                    backgroundColor:
                      item.saleId === selectedOne?.saleId
                        ? '#def3ff'
                        : 'transparent',
                  }"
                >
                  <td class="text-center">
                    {{ index + 1 }}
                  </td>

                  <td class="text-center">
                    {{ item.voucherCode }}
                  </td>

                  <td class="text-center">
                    {{ getCustomerName(item.customerId) }}
                  </td>

                  <td class="text-center">
                    {{ formatDate(item.receivedDate) }}
                  </td>

                  <td class="text-center">
                    {{ item.remark }}
                  </td>

                  <td class="text-center">
                    <v-icon
                      @click.stop="clickEdit(item)"
                      color="info"
                      icon="mdi-pencil"
                      size="small"
                    ></v-icon>

                    <v-icon
                      @click.stop="showDeleteDialog(item)"
                      class="ml-2"
                      color="red"
                      icon="mdi-delete"
                      size="small"
                    ></v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" md="12">

          <v-dialog v-model="dialogSale" max-width="600" persistent>
            <v-card title="Sale">
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      label="Customer Name"
                      :items="customerList"
                      item-title="profileName"
                      item-value="useraccountId"
                      v-model="sale.customerId"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Voucher Code"
                      v-model="sale.voucherCode"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Received Date"
                      type="date"
                      v-model="sale.receivedDate"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Remark"
                      v-model="sale.remark"
                    />
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer />

                <v-btn
                  text="Close"
                  variant="plain"
                  @click="dialogSale = false"
                />

                <v-btn
                  color="primary"
                  :text="saveOrupdate"
                  variant="tonal"
                  @click="clickSaveOrUpdate()"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="400">
            <v-card title="Confirm Delete">
              <v-card-text>
                Are you sure you want to delete
                {{ selectedOne.voucherCode }}?
              </v-card-text>

              <v-card-actions>
                <v-spacer />

                <v-btn
                  variant="plain"
                  @click="dialogDelete = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                  color="red"
                  variant="tonal"
                  @click="clickDeleteMethod()"
                >
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            :timeout="3000"
            location="top right"
          >
            {{ snackbarText }}
          </v-snackbar>

        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>

<script>
import saleService from "../service/SaleService.js";
import userService from "../service/UserAccountService.js";

export default {
  data: () => ({
    selectedOne: {},
    saleList: [],
    filterSaleList: [],
    customerList: [],
    searchVoucher: "",
    filterCustomerId: null,

    dialogSale: false,
    dialogDelete: false,

    saveOrupdate: "SAVE",

    snackbar: false,
    snackbarText: "",
    snackbarColor: "success",

    sale: {
      saleId: null,
      userAccountId: 1,
      customerId: null,
      receivedDate: "",
      voucherCode: "",
      remark: "",
    },
  }),

  mounted() {
    this.saleListMethod();
    this.customerListMethod();
  },

  methods: {

    saleListMethod() {
      saleService
        .getSaleList()
        .then((response) => {
          this.saleList = response || [];
          this.filterSaleMethod();
        })
        .catch((error) => {
          console.error("Error loading sale:", error);
        });
    },

    customerListMethod() {
      userService
        .getUseraccount("CUSTOMER")
        .then((response) => {
          this.customerList = response || [];
        })
        .catch((error) => {
          console.error("Error loading customer:", error);
        });
    },

    getCustomerName(customerId) {
      let customer = this.customerList.find(
        (item) => item.useraccountId == customerId
      );

      return customer ? customer.profileName : "";
    },

    filterSaleMethod() {
      this.filterSaleList = this.saleList.filter((item) => {

        let matchVoucher = !this.searchVoucher ||
          item.voucherCode?.toLowerCase().includes(
            this.searchVoucher.toLowerCase()
          );

        let matchCustomer = this.filterCustomerId == null ||
          item.customerId == this.filterCustomerId;

        return matchVoucher && matchCustomer;
      });
    },

    clickAddSale() {
      this.sale = {
        saleId: null,
        userAccountId: 1,
        customerId: null,
        receivedDate: "",
        voucherCode: "",
        remark: "",
      };

      this.saveOrupdate = "SAVE";
      this.dialogSale = true;
    },

    clickEdit(item) {
      this.sale = { ...item };

      this.saveOrupdate = "UPDATE";
      this.dialogSale = true;
    },

    clickSaveOrUpdate() {
      console.log("Sale Data:", this.sale);

      let request;

      if (this.saveOrupdate === "SAVE") {
        request = saleService.addSale(this.sale);
      } else {
        request = saleService.updateSale(this.sale);
      }

      request
        .then(() => {
          if (this.saveOrupdate === "SAVE") {
            this.showSnackbar(
              "Sale saved successfully!",
              "success"
            );
          } else {
            this.showSnackbar(
              "Sale updated successfully!",
              "success"
            );
          }

          this.dialogSale = false;
          this.saleListMethod();
        })
        .catch((error) => {
          console.error("Save/Update Failed:", error);
          console.error("Backend Error:", error.response?.data);

          this.showSnackbar("Failed to save sale.", "error");
        });
    },

    showDeleteDialog(item) {
      this.selectedOne = { ...item };
      this.dialogDelete = true;
    },

    clickDeleteMethod() {
      saleService
        .deleteSale(this.selectedOne)
        .then(() => {
          this.showSnackbar(
            "Sale deleted successfully!",
            "success"
          );

          this.dialogDelete = false;
          this.selectedOne = {};

          this.saleListMethod();
        })
        .catch((error) => {
          console.error("Delete Failed:", error);
          console.error("Backend Error:", error.response?.data);

          this.showSnackbar("Failed to delete sale.", "error");
        });
    },

    showSnackbar(message, color = "success") {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },

    formatDate(date) {
      if (!date) return "";

      return new Date(Number(date)).toISOString().split("T")[0];
    },

  },

  watch: {},
  components: {},
};
</script>

<style scoped>
</style>
