<template>
  <v-row no-gutters>

<v-col col="8" md="8">
      <v-table fixed-header height="69vh" density="compact">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center white--text bg-primary">No.</th>
              <th class="text-center white--text bg-primary">Product Type Name</th>
              <th class="text-center white--text bg-primary">Product Name</th>
              <th class="text-center white--text bg-primary">Detail</th>
              <th class="text-center white--text bg-primary">Amount</th>
              <th class="text-center white--text bg-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in productList"
              :key="index"
              @click="selectedOne = item"
              :style="{
                backgroundColor:
                  item.productId == selectedOne.productId
                    ? '#def3ff'
                    : 'transparent',
              }"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.productTypeDto.name }}</td>
              <td class="text-center">{{ item.productName }}</td>
              <td class="text-center">{{ item.detail }}</td>
              <td class="text-center">{{ item.amount }}</td>
              <td class="text-center">
                <v-icon
                  @click="clickEdit(item)"
                  color="info"
                  icon="mdi-pencil"
                  size="small"
                ></v-icon>
                <v-icon
                  @click="showDeleteDialog(item)"
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
<v-col col="4" md="4">

</v-col>

  </v-row> 
</template>
<script>
import productService from "../service/ProductService.js";
export default {
  data: () => ({
    productList: [],
    selectedOne: {},
    product:{
      productType:{},
    }
  }),
   props: {},
  mounted: function() {
    this.getProductListMethod();
  },
  methods: {
    getProductListMethod:function(){
      productService
        .getProductList()
        .then((response) => {
          this.productList.splice(0);
          this.productList.push(...response);
        })
        .catch(() => {
          // this.$swal("Fail!", error.response.data.message, "error");
        });
    }
  },
  watch: {},
  components: {}
};
</script>
<style scoped>

</style>