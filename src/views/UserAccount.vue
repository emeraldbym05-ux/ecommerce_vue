<template>
    <v-row no-gutters>
        <v-col cols="12" md="12">
            <v-combobox label="Type Name" :items="typeList" item-title="typeName" item-value="typeName" v-model="type"
                return-object @update:model-value="changeType()"></v-combobox>
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
                        <tr v-for="(item, index) in userList" :key="index" @click="selectedOne = item" :style="{
                            backgroundColor:
                                item.useraccountId == selectedOne.useraccountId ? '#def3ff' : 'transparent',
                        }">
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
                                <v-icon @click="clickEdit(item)" color="info" icon="mdi-pencil" size="small"></v-icon>
                                <v-icon @click="showDeleteDialog(item)" class="ml-2" color="red" icon="mdi-delete"
                                    size="small"></v-icon>
                            </td>
                        </tr>
                        <v-divider />
                    </tbody>
                </template>
            </v-table>
        </v-col>

    </v-row>
</template>
<script>
import userService from "../service/UserAccountService.js";
export default {
    data: () => ({
        selectedOne: {},
        userList: [],
        typeList: ["SUPPLIER", "CUSTOMER"],
        type: "CUSTOMER",
    }),
    props: {},
    mounted: function () {
        this.userListMethod();
    },
    methods: {
        changeType:function () {
            this.userListMethod();
        },
        userListMethod: function () {
            userService
                .getUseraccount(this.type)
                .then((response) => {
                    //console.log(response);
                    this.userList.splice(0);
                    this.userList.push(...response);
                })
                .catch(() => {
                    // this.$swal("Fail!", error.response.data.message, "error");
                });
        },
    },
    watch: {},
    components: {}
};
</script>
<style scoped></style>