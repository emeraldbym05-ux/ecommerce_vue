<template>
  <v-row no-gutters>
    <v-col cols="12" md="12">
<v-row no-gutters align="center">
  <v-col cols="3" md="3" class="px-2">
    <v-select
      label="City Name"
      :items="cityFilterList"
      item-title="cityName"
      item-value="cityId"
      v-model="filterCityId"
      clearable
      @update:model-value="changeFilterCity()"
    ></v-select>
  </v-col>

  <v-col cols="3" md="3" class="px-2">
  <v-select
  label="Township Name"
  :items="townshipFilterList"
  item-title="townshipName"
  item-value="townshipId"
  v-model="filterTownshipId"
  clearable
  @update:model-value="filterUserMethod()"
></v-select>
  </v-col>

  <v-col cols="3" md="3" class="px-2">
    <v-combobox
      label="Type Name"
      :items="typeList"
      v-model="type"
      @update:model-value="changeType()"
    ></v-combobox>
  </v-col>

  <v-col cols="1" md="1" class="d-flex align-center">
    <v-icon
      color="green"
      @click="clickAddUser()"
    >mdi-plus-circle</v-icon>
  </v-col>
</v-row>

    </v-col>
    <v-col cols="12" md="12">
      <v-table fixed-header height="69vh" density="compact">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center white--text bg-primary">No.</th>
              <th class="text-center white--text bg-primary">City Name</th>
              <th class="text-center white--text bg-primary">Township Name</th>
              <th class="text-center white--text bg-primary">Profile Name</th>
              <th class="text-center white--text bg-primary">User Name</th>
              <th class="text-center white--text bg-primary">Phone</th>
              <th class="text-center white--text bg-primary">Address</th>
              <th class="text-center white--text bg-primary">Type</th>
              <th class="text-center white--text bg-primary">Status</th>
              <th class="text-center white--text bg-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filterUserList"
              :key="index"
              @click="selectedOne = item"
              :style="{
                backgroundColor:
                  item.useraccountId == selectedOne.useraccountId
                    ? '#def3ff'
                    : 'transparent',
              }"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ item?.cityDto?.cityName }}</td>
              <td class="text-center">{{ item?.townshipDto?.townshipName }}</td>
              <td class="text-center">{{ item?.profileName }}</td>
              <td class="text-center">{{ item?.userName }}</td>
              <td class="text-center">{{ item?.phone }}</td>
              <td class="text-center">{{ item?.address }}</td>
              <td class="text-center">{{ item?.type }}</td>
              <td class="text-center">{{ item?.status }}</td>
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
    <v-col col="12" md="12">
      <v-dialog v-model="dialogUser" max-width="600" persistent>
        <v-card prepend-icon="mdi-account" title="User Profile">
          <v-card-text>
            <v-row density="comfortable">
              <v-col cols="6" md="6">
                <v-combobox
                  label="City Name"
                  :items="cityList"
                  item-title="cityName"
                  item-value="cityName"
                  v-model="user.cityDto"
                  return-object
                  @update:model-value="changeCity()"
                ></v-combobox>
              </v-col>
              <v-col cols="6" md="6">
                <v-combobox
                  label="Township Name"
                  :items="townshipList"
                  item-title="townshipName"
                  item-value="townshipName"
                  v-model="user.townshipDto"
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="6" md="6">
                <v-text-field
                  label="User Name"
                  v-model="user.userName"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-text-field
                  label="Password"
                  v-model="user.password"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-text-field
                  label="Profile Name"
                  v-model="user.profileName"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-text-field label="Phone" v-model="user.phone"></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-text-field
                  label="address"
                  v-model="user.address"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
               <v-combobox
  label="Type Name"
  :items="typeList"
  v-model="user.type"
></v-combobox>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Close"
              variant="plain"
              @click="dialogUser = false"
            ></v-btn>

            <v-btn
              color="primary"
              :text="saveOrupdate"
              variant="tonal"
              @click="clickSaveOrUpdate()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
  <v-dialog v-model="dialogDelete" max-width="400">
  <v-card>
    <v-card-title>Confirm Delete</v-card-title>

    <v-card-text>
      Are you sure you want to delete this user?
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="grey" @click="dialogDelete = false">
        CANCEL
      </v-btn>

      <v-btn color="red" @click="deleteUser()">
        DELETE
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import userService from "../service/UserAccountService.js";
import cityService from "../service/CityService.js";
import townshipService from "../service/TownshipService.js";
export default {
  data: () => ({
    selectedOne: {},
    userList: [],
    type: "CUSTOMER",
    dialogUser: false,
    saveOrupdate: "SAVE",
    cityList: [],
    cityDto: {},
    townshipList: [],
    townshipDto: {},
    typeList: ["SUPPLIER", "CUSTOMER"],
    user: { cityDto: {}, townshipDto: {} },
    filterCityId: null,
filterTownshipId: null,
cityFilterList: [],
townshipFilterList: [],
filterUserList: [],
dialogDelete: false,
  }),
  props: {},
  mounted: function () {
  this.userListMethod();
  this.filterCityListMethod();
},
  methods: {
    changeCity: function () {
      this.townshipListMethod();
    },
    townshipListMethod: function () {
      townshipService
        .getTownship(this.user.cityDto.cityId)
        .then((response) => {
          this.townshipList.splice(0);
          //this.townshipList.push({townshipId:0,townshipName:"All"});
          this.townshipList.push(...response);
          this.user.townshipDto = this.townshipList[0];
          //this.tsListMethod();
          console.log("Township Response:", response);
        })
        .catch(() => {
          // this.$swal("Fail!", error.response.data.message, "error");
        });
    },
    cityListMethod: function () {
      cityService
        .getCity()
        .then((response) => {
          this.cityList.splice(0);
          this.cityList.push(...response);
          this.user.cityDto = this.cityList[0];
          this.townshipListMethod();
          //this.tsListMethod();
        })
        .catch(() => {
          // this.$swal("Fail!", error.response.data.message, "error");
        });
    },
   clickSaveOrUpdate() {
  if (this.saveOrupdate == "SAVE") {
    userService.addUserAccount(this.user).then((response) => {
      this.dialogUser = false;
      this.user = { cityDto: {}, townshipDto: {} };
      this.userListMethod();
    });
  } else {
    userService.updateUserAccount(this.user).then((response) => {
      this.dialogUser = false;
      this.user = { cityDto: {}, townshipDto: {} };
      this.userListMethod();
    });
  }
},

   clickEdit(item) {
  this.saveOrupdate = "UPDATE";

  this.user = JSON.parse(JSON.stringify(item));

  this.user.password = "";

  cityService.getCity().then((response) => {
    this.cityList = response;

    townshipService.getTownship(this.user.cityDto.cityId).then((response) => {
      this.townshipList = response;

      this.dialogUser = true;
    });
  });
},
 clickAddUser() {
  this.saveOrupdate = "SAVE";

  this.user = {
    useraccountId: null,
    cityDto: {},
    townshipDto: {},
    userName: "",
    password: "",
    profileName: "",
    phone: "",
    address: "",
    type: this.type,
    status: 1
  };

  this.dialogUser = true;
  this.cityListMethod();
},

showDeleteDialog(item) {
  this.selectedOne = item;
  this.dialogDelete = true;
},

deleteUser() {
  userService.deleteUserAccount(this.selectedOne).then((response) => {
    this.dialogDelete = false;
    this.selectedOne = {};
    this.userListMethod();
  });
},
    changeType: function () {
      this.userListMethod();
    },
  userListMethod: function () {
  userService
    .getUseraccount(this.type)
    .then((response) => {
      this.userList.splice(0);
      this.userList.push(...response);

      this.filterUserMethod();
    })
    .catch(() => {
      console.log("Cannot load User");
    });
},
    filterCityListMethod: function () {
  cityService
    .getCity()
    .then((response) => {
      this.cityFilterList.splice(0);
      this.cityFilterList.push(...response);
    })
    .catch(() => {
      console.log("Cannot load City");
    });
},



filterUserMethod: function () {
  this.filterUserList.splice(0);

  for (let item of this.userList) {
    if (this.filterCityId != null &&
        item.cityDto.cityId != this.filterCityId) {
      continue;
    }

    if (this.filterTownshipId != null &&
        item.townshipDto.townshipId != this.filterTownshipId) {
      continue;
    }

    this.filterUserList.push(item);
  }
},

changeFilterCity: function () {
  this.filterTownshipId = null;
  this.townshipFilterList.splice(0);

  if (this.filterCityId != null) {
    townshipService
      .getTownship(this.filterCityId)
      .then((response) => {
        this.townshipFilterList.splice(0);
        this.townshipFilterList.push(...response);

        this.filterUserMethod();
      })
      .catch(() => {
        console.log("Cannot load Township");
      });
  } else {
    this.filterUserMethod();
  }
},
  },
  watch: {},
  components: {},
};
</script>
<style scoped></style>
