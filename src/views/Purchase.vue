
<template>
  <v-row no-gutters>
    <v-col cols="12" md="12">
      <v-row no-gutters align="center">
        <v-col cols="3" md="3">
          <v-select
            label="Supplier Name"
            :items="supplierList"
            item-title="profileName"
            item-value="useraccountId"
            v-model="filterSupplierId"
            clearable
            @update:model-value="filterPurchaseMethod()"
          ></v-select>
        </v-col>

        <v-col cols="3" md="3" class="pl-2">
          <v-text-field
            label="Search Voucher Code"
            v-model="searchVoucher"
            clearable
            @update:model-value="filterPurchaseMethod()"
          />
        </v-col>

        <v-col cols="1" md="1">
          <v-icon
            color="green"
            class="pt-4 pl-2"
            @click="clickAddPurchase()"
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
                  <th class="text-center white--text bg-primary">No.</th>
                  <th class="text-center white--text bg-primary">
                    Voucher Code
                  </th>
                  <th class="text-center white--text bg-primary">
                    Supplier Name
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
                  v-for="(item, index) in filterPurchaseList"
                  :key="item.purchaseId"
                  @click="selectedOne = item"
                  :style="{
                    backgroundColor:
                      item.purchaseId === selectedOne?.purchaseId
                        ? '#def3ff'
                        : 'transparent',
                  }"
                >
                  <td class="text-center">{{ index + 1 }}</td>

                  <td class="text-center">
                    {{ item.voucherCode }}
                  </td>

                  <td class="text-center">
                    {{ getSupplierName(item.supplierId) }}
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
          <v-dialog v-model="dialogPurchase" max-width="600" persistent>
            <v-card title="Purchase">
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      label="Supplier Name"
                      :items="supplierList"
                      item-title="profileName"
                      item-value="useraccountId"
                      v-model="purchase.supplierId"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Voucher Code"
                      v-model="purchase.voucherCode"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Received Date"
                      type="date"
                      v-model="purchase.receivedDate"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Remark"
                      v-model="purchase.remark"
                    />
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer />

                <v-btn
                  text="Close"
                  variant="plain"
                  @click="dialogPurchase = false"
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
            {{ snackbarText}}
          </v-snackbar>

        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>

<script>
import purchaseService from "../service/PurchaseService.js";
import userService from "../service/UserAccountService.js";

export default {
  data: () => ({
    selectedOne: {},
    purchaseList: [],
    filterPurchaseList: [],
    supplierList: [],
    searchVoucher: "",
    filterSupplierId: null,
    dialogPurchase: false,
    dialogDelete: false,
    saveOrupdate: "SAVE",
    snackbar: false,
    snackbarText: "",
    snackbarColor: "success",

    purchase: {
      purchaseId: null,
      userAccountId: 1,
      supplierId: null,
      receivedDate: "",
      voucherCode: "",
      remark: "",
    },
  }),

  mounted() {
    this.purchaseListMethod();
    this.supplierListMethod();
  },

  methods: {

    purchaseListMethod() {
      purchaseService
        .getPurchaseList()
        .then((response) => {
          this.purchaseList = response || [];
          this.filterPurchaseMethod();
        })
        .catch((error) => {
          console.error("Error loading purchase:", error);
        });
    },

    supplierListMethod() {
      userService
        .getUseraccount("SUPPLIER")
        .then((response) => {
          this.supplierList = response || [];
        })
        .catch((error) => {
          console.error("Error loading supplier:", error);
        });
    },

    getSupplierName(supplierId) {
      let supplier = this.supplierList.find(
        (item) => item.useraccountId == supplierId
      );

      return supplier ? supplier.profileName : "";
    },

    filterPurchaseMethod() {
      this.filterPurchaseList = this.purchaseList.filter((item) => {

        let matchVoucher = !this.searchVoucher ||
          item.voucherCode?.toLowerCase().includes(
            this.searchVoucher.toLowerCase()
          );

        let matchSupplier = this.filterSupplierId == null ||
          item.supplierId == this.filterSupplierId;

        return matchVoucher && matchSupplier;
      });
    },

    clickAddPurchase() {
      this.purchase = {
        purchaseId: null,
        userAccountId: 1,
        supplierId: null,
        receivedDate: "",
        voucherCode: "",
        remark: "",
      };

      this.saveOrupdate = "SAVE";
      this.dialogPurchase = true;
    },

    clickEdit(item) {
      this.purchase = { ...item };

      this.saveOrupdate = "UPDATE";
      this.dialogPurchase = true;
    },

    clickSaveOrUpdate() {
      console.log("Purchase Data:", this.purchase);

      let request;

      if (this.saveOrupdate === "SAVE") {
        request = purchaseService.addPurchase(this.purchase);
      } else {
        request = purchaseService.updatePurchase(this.purchase);
      }

      request
        .then(() => {
          if (this.saveOrupdate === "SAVE") {
            this.showSnackbar(
              "Purchase saved successfully!",
              "success"
            );
          } else {
            this.showSnackbar(
              "Purchase updated successfully!",
              "success"
            );
          }

          this.dialogPurchase = false;
          this.purchaseListMethod();
        })
        .catch((error) => {
          console.error("Save/Update Failed:", error);
          console.error("Backend Error:", error.response?.data);

          this.showSnackbar("Failed to save purchase.", "error");
        });
    },

    showDeleteDialog(item) {
      this.selectedOne = { ...item };
      this.dialogDelete = true;
    },

    clickDeleteMethod() {
      purchaseService
        .deletePurchase(this.selectedOne)
        .then(() => {
          this.showSnackbar(
            "Purchase deleted successfully!",
            "success"
          );

          this.dialogDelete = false;
          this.selectedOne = {};

          this.purchaseListMethod();
        })
        .catch((error) => {
          console.error("Delete Failed:", error);
          console.error("Backend Error:", error.response?.data);

          this.showSnackbar("Failed to delete purchase.", "error");
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
