<template>
  <v-row no-gutters>
    <v-col cols="8" md="8">
      <v-table fixed-header height="69vh" density="compact">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center white--text bg-primary">No.</th>
              <th class="text-center white--text bg-primary">City Name</th>
              <th class="text-center white--text bg-primary">Township Name</th>
              <th class="text-center white--text bg-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in tsList"
              :key="index"
              @click="selectedOne = item"
              :style="{
                backgroundColor:
                  item.townshipId == selectedOne.townshipId
                    ? '#def3ff'
                    : 'transparent',
              }"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item.cityDto.cityName }}</td>
              <td class="text-center">{{ item?.townshipName }}</td>
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
      <v-row>
        <v-col cols="12" md="12">
          <v-combobox
            label="City Name"
            :items="cityList"
            item-title="cityName"
            item-value="cityName"
            v-model="township.cityDto"
            return-object
          ></v-combobox>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field
            label="Township Name"
            v-model="township.townshipName"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="text-right">
          <v-btn variant="tonal" @click="clickSave()">
            {{ saveOrupdate }}
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import townshipService from "../service/TownshipService.js";
import cityService from "../service/CityService.js";
export default {
  data: () => ({
    selectedOne: {},
    tsList: [],
    cityList: [],

    township: { cityDto: {} },
    saveOrupdate: "SAVE",
  }),
  props: {},
  mounted: function () {
    this.tsListMethod();
    this.cityListMethod();
  },
  methods: {
    clickSave: function () {
      // if ("SAVE" == this.saveOrupdate) {
      townshipService
        .addTownship(this.township)
        .then(() => {
          this.township = {};
          this.tsListMethod();
        })
        .catch(() => {
          // this.$swal("Fail!", error.response.data.message, "error");
        });
      // } else {
      //   cityService
      //     .updateCity(this.city)
      //     .then(() => {
      //       this.cityListMethod();
      //     })
      //     .catch(() => {
      //       // this.$swal("Fail!", error.response.data.message, "error");
      //     });
      // }
    },
    cityListMethod: function () {
      cityService
        .getCity()
        .then((response) => {
          this.cityList.splice(0);
          this.cityList.push(...response);
          this.township.cityDto = this.cityList[0];
        })
        .catch(() => {
          // this.$swal("Fail!", error.response.data.message, "error");
        });
    },
    tsListMethod: function () {
      townshipService
        .getTownship()
        .then((response) => {
          //console.log(response);
          this.tsList.splice(0);
          this.tsList.push(...response);
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
