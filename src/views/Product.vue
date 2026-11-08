<template>
  <v-row no-gutters>
    <v-col cols="12" md="12">
      <v-row no-gutters>
        <v-col cols="4" md="4"> </v-col>
        <v-col cols="4" md="4"> </v-col>
        <v-col cols="3" md="3">
          <v-combobox
  label="Product Type"
  :items="typeList"
  v-model="type"
  @update:model-value="changeType"
/>
        </v-col>
        <v-col cols="1" md="1">
          <v-icon color="green" class="pt-4 pl-4" @click="clickAddUser()"
            >mdi-plus-circle</v-icon
          >
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="12">
      <v-table fixed-header height="69vh" density="compact">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center white--text bg-primary">No.</th>
              <th class="text-center white--text bg-primary">
                Product Type Name
              </th>
              <th class="text-center white--text bg-primary">Product Name</th>
              <th class="text-center white--text bg-primary">Detail</th>
              <th class="text-center white--text bg-primary">Amount</th>
              <th class="text-center white--text bg-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
  v-for="(item, index) in productList"
  :key="item.productId ?? index"
  @click="selectedOne = item"
  :style="{
    backgroundColor:
      item.productId === selectedOne?.productId
        ? '#def3ff'
        : 'transparent',
  }"
>
  <td class="text-center">{{ index + 1 }}</td>
  <td class="text-center">
    {{ item.productTypeDto?.name }}
  </td>
  <td class="text-center">{{ item.productName }}</td>
  <td class="text-center">{{ item.detail }}</td>
  <td class="text-center">{{ item.amount }}</td>
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
            <v-divider />
          </tbody>
        </template>
      </v-table>
    </v-col>
    <v-col col="12" md="12">
      <v-dialog v-model="dialogUser" max-width="600" persistent>
        
  <v-card title="Product">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
  label="Product Type"
  :items="productTypeList"
  item-title="name"
  return-object
  v-model="product.productTypeDto"
/>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Product Name"
            v-model="product.productName"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Detail"
            v-model="product.detail"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Amount"
            type="number"
            v-model.number="product.amount"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        text="Close"
        variant="plain"
        @click="dialogUser = false"
      />
      <v-btn
        color="primary"
        :text="saveOrupdate"
        variant="tonal"
        @click="clickSaveOrUpdate"
      />
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
<v-dialog v-model="dialogDelete" max-width="400">
  <v-card title="Confirm Delete">
    <v-card-text>
      Are you sure you want to delete
      {{ selectedOne.productName }}?
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
        @click="clickDeleteMethod"
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
</template>
<script>
import productService from "../service/ProductService.js";

export default {
  data: () => ({
  selectedOne: {},
  productList: [],
  type: null,
  dialogUser: false,
  saveOrupdate: "SAVE",
  dialogDelete: false,
  snackbar: false,
snackbarText: "",
snackbarColor: "success",

  productTypeList: [
    {
      productTypeId: 1,
      name: "Skincare",
    },
    {
      productTypeId: 2,
      name: "Makeup",
    },
  ],

  typeList: ["Skincare", "Makeup"],

  product: {
    userAccountId: 1,
    productTypeDto: {},
    productName: "",
    detail: "",
    amount: 0,
    status: 1,
  },
}),
  props: {},
  mounted() {
  this.productListMethod();
},
  methods: {
  productListMethod() {
  productService
    .getProductList()
    .then((response) => {
      console.log("Product List:", response);

      const products = response || [];

      if (!this.type) {
        this.productList = products;
      } else {
        this.productList = products.filter(
          (item) =>
            item.productTypeDto?.name === this.type
        );
      }
    })
    .catch((error) => {
     // console.error("Error loading products:", error);
    });
},

changeType() {
  this.productListMethod();
},
    
clickAddUser() {
  this.product = {
    productId: null,
    userAccountId: 1,
    productTypeDto: {},
    productName: "",
    detail: "",
    amount: 0,
    status: 1,
  };

  this.saveOrupdate = "SAVE";
  this.dialogUser = true;
},
 
clickSaveOrUpdate() {

  this.product.productTypeId =
    this.product.productTypeDto.productTypeId;

  let request;

  if (this.saveOrupdate === "SAVE") {
    request = productService.addProduct(this.product);
  } else {
    request = productService.updateProduct(this.product);
  }

  request
    .then((response) => {
      if (this.saveOrupdate === "SAVE") {
        this.showSnackbar("Product saved successfully!", "success");
      } else {
        this.showSnackbar("Product updated successfully!", "success");
      }

      this.dialogUser = false;
      this.productListMethod();
    })
    .catch((error) => {
      console.error("Save/Update Failed:", error);
      console.error("Backend Error:", error.response?.data);

      this.showSnackbar("Failed to save product.", "error");
    });
},
    
    
    clickEdit(item) {
  this.product = {
    ...item,
    productTypeDto: { ...item.productTypeDto },
  };

  this.dialogUser = true;
  this.saveOrupdate = "UPDATE";
},

clickDeleteMethod() {
  productService
    .deleteProduct(this.selectedOne)
    .then(() => {
      this.showSnackbar("Product deleted successfully!", "success");

      this.dialogDelete = false;
      this.selectedOne = {};

      this.productListMethod();
    })
    .catch((error) => {
      console.error("Delete Failed:", error);
      console.error("Backend Error:", error.response?.data);

      this.showSnackbar("Failed to delete product.", "error");
    });
},
    showDeleteDialog(item) {
  this.selectedOne = { ...item };
  this.dialogDelete = true;
},

showSnackbar(message, color = "success") {
  this.snackbarText = message;
  this.snackbarColor = color;
  this.snackbar = true;
},
  },
  watch: {},
  components: {},
};
</script>
<style scoped></style>
