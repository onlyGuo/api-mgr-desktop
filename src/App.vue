<template>
  <v-app style="user-select: none;">
    <v-app-bar
      app
      color="primary"
      dark
      style="-webkit-app-region: drag;"
      height="56"
    >
        <div style="text-align: center; width: 100%;">
            API 接口管理器
        </div>
      <div class="d-flex align-center">
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main style="padding: 0; margin-top: 56px; overflow: auto; height: 1px; display:flex">
      <router-view/>
    </v-main>
      <v-dialog
          v-model="dialog"
          persistent
          max-width="290"
      >
          <v-card>
              <v-card-title class="text-h6">
                  请先配置服务器地址
              </v-card-title>
              <div style="padding: 0 10px">
                  <v-text-field label="例: http://localhost:8080" v-model="serverCtx"></v-text-field>
              </div>

              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="green darken-1"
                      text
                      @click="setCtx"
                  >
                      确定
                  </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </v-app>
</template>

<script>

import Axios from "axios";

export default {
  name: 'App',

  data: () => ({
      dialog: false,
      serverCtx: 'http://localhost:8080'
    //
  }),
    created() {
      if (!this.ser.ctx){
          this.dialog = true
      }
    },
    methods: {
      setCtx(){
          this.ser.ctx = this.serverCtx + '/api/v1/'
          Axios.defaults.baseURL = this.ser.ctx
          this.dialog = false
          this.go('/home')
      }
    }
};
</script>

<style scoped lang="less">
</style>
