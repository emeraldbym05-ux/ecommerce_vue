<template>
  <v-row no-gutters>
    <v-col cols="8" md="8">
      <v-table fixed-header height="69vh" density="compact">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center white--text bg-primary">No.</th>
              <!-- <th class="text-center white--text bg-primary">CityId</th> -->
              <th class="text-center white--text bg-primary">City Name</th>
              <th class="text-center white--text bg-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in cityList"
              :key="index"
              @click="selectedOne = item"
              :style="{
                backgroundColor:
                  item.cityId == selectedOne.cityId ? '#def3ff' : 'transparent',
              }"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <!-- <td class="text-center">{{ item?.cityId }}</td> -->
              <td class="text-center">{{ item?.cityName }}</td>
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
    <v-col cols="4" md="4">
      <v-row no-gutters>
        <v-col cols="12" md="12">
          <v-text-field
            label="City Name"
            v-model="city.cityName"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="text-right">
          <v-btn variant="tonal" @click="clickSave()">
            {{ saveOrupdate }}
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="12">
      <v-dialog max-width="500" v-model="dialogDelete">
        <v-card title="Dialog">
          <v-card-text>
            Are you sure to delete {{ deleteCity.cityName }} ?</v-card-text
          >

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Cancel" @click="dialogDelete = false"></v-btn>
            <v-btn
              text="Delete"
              @click="clickDeleteMethod()"
              color="red"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
import cityService from "../service/CityService.js";
export default {
  data: () => ({
    selectedOne: {},
    cityList: [],
    saveOrupdate: "SAVE",
    city: {},
    deleteCity: {},
    dialogDelete: false,
  }),
  props: {},
  mounted: function () {
    this.cityListMethod();
  },
  methods: {
    cityListMethod: function () {
      cityService
        .getCity()
        .then((response) => {
          this.cityList.splice(0);
          this.cityList.push(...response);
        })
        .catch(() => {
          // this.$swal("Fail!", error.response.data.message, "error");
        });
    },
    clickSave: function () {
      if ("SAVE" == this.saveOrupdate) {
        cityService
          .addCity(this.city)
          .then(() => {
            this.city = {};
            this.cityListMethod();
          })
          .catch(() => {
            // this.$swal("Fail!", error.response.data.message, "error");
          });
      } else {
        cityService
          .updateCity(this.city)
          .then(() => {
            this.city = {};
            this.cityListMethod();
          })
          .catch(() => {
            // this.$swal("Fail!", error.response.data.message, "error");
          });
      }
    },
    clickEdit: function (item) {
      this.city = Object.assign({}, item);
      this.saveOrupdate = "UPDATE";
    },
    showDeleteDialog: function (item) {
      this.deleteCity = Object.assign({}, item);
      this.dialogDelete = true;
    },
    clickDeleteMethod: function () {
      cityService
        .deleteCity(this.deleteCity)
        .then(() => {
          this.dialogDelete = false;
          this.cityListMethod();
        })
        .catch(() => {
          // this.$swal("Fail!", error.response.data.message, "error");
        });
    },
  },
  watch: {},
  components: {},
};
</script>
<style scoped></style>
