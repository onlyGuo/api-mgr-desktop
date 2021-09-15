<template>
    <div class="box" ref="box">
        <div class="left" :elevation="2" :style="`width: ` + leftWhite + `px`">
            <div style="height: 40px">
                <v-btn depressed style="width: 50px; vertical-align: top"
                       @click="showNewProject = true"> + </v-btn>
                <v-text-field label="Search"
                              style="width: calc(100% - 70px);
                              vertical-align: top;
                              margin-top: -10px;
                              display: inline-block"></v-text-field>
            </div>
            <v-list >
                <v-list-group
                    prepend-icon="mdi-account-circle"
                    v-for="project in items" :key="project.id"
                >
                    <template v-slot:activator>
                        <v-list-item-title>{{project.name}}</v-list-item-title>
                    </template>

                    <v-list-group
                        :value="true"
                        no-action
                        sub-group
                        v-for="group in project.items"
                        :key="group.id"
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>{{group.name}}</v-list-item-title>
                            </v-list-item-content>
                        </template>

                        <v-list-item
                            v-for="(api, i) in group.items"
                            :key="api.id"
                            link
                            @click="selectApi(api.id)"
                        >
                            <v-list-item-content>
                                <v-list-item-title v-text="api.name"></v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon color="grey lighten-1" @click.stop="deleteApi(group.items, i)">mdi-delete</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-btn elevation="2" block @click="showNewApi = true; selectGroup = group"> + 新增接口</v-btn>
                    </v-list-group>
                    <v-btn elevation="2" block @click="showNewGroup = true; selectProject = project"> + 新增组</v-btn>
                </v-list-group>
            </v-list>
        </div>
        <div class="split" :style="`left: ` + leftWhite + `px`" @mousedown="startResizeLeft">

        </div>
        <div class="right" :style="`width: calc(100% - ` + leftWhite + `px);`">
            <hello-world v-if="!isSelectApi" />
            <router-view />
        </div>


        <!-- 新建项目 -->
        <v-dialog
            v-model="showNewProject"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="text-h5">
                    新建项目
                </v-card-title>
                <v-card-text>
                    <v-text-field label="请输入项目名称" v-model="newProjectName"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="showNewProject = false"
                    >
                        取消
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="addProject"
                    >
                        确定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 新建组 -->
        <v-dialog
            v-model="showNewGroup"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="text-h5">
                    新建接口组
                </v-card-title>
                <v-card-text>
                    <v-text-field label="请输入组名称" v-model="newGroupName"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="showNewGroup = false"
                    >
                        取消
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="addGroup(selectProject)"
                    >
                        确定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 新建接口 -->
        <v-dialog
            v-model="showNewApi"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="text-h5">
                    新建接口组
                </v-card-title>
                <v-card-text>
                    <v-text-field label="请输入组名称" v-model="newApiName"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="showNewApi = false"
                    >
                        取消
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="addApi(selectGroup)"
                    >
                        确定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style scoped lang="less">
.box{
    width: 100%;
    height: 100%;
}
    .left{
        height: 100%;
        overflow: auto;
        float: left;
        background-color: rgba(0,0,0,.05);
    }
    .split{
        top: 0;
        bottom: 0;
        width: 5px;
        position: fixed;
        //border-right: 1px solid rgba(25,118,210);
        z-index: 1;
        cursor: col-resize;
        box-shadow: rgba(0,0,0,.4) -4px 2px 6px -1px;
    }
    .right{
        height: 100%;
        overflow: auto;
        float: right;
    }
</style>

<script>
  import HelloWorld from '../components/HelloWorld'

  export default {
    name: 'Home',

    components: {
      HelloWorld,
    },
      data(){
        return {
            leftWhite: 284,
            muX: 0,
            showNewProject: false,
            newProjectName: '',
            showNewGroup: false,
            newGroupName: '',
            selectProject: null,
            showNewApi: false,
            newApiName: '',
            selectGroup: null,
            isSelectApi: false,
            selectApiId: '',
            items: [

            ],
        }
      },
      methods: {
          startResizeLeft(ev){
              this.muX = ev.clientX - this.leftWhite
              this.$refs.box.addEventListener('mousemove', this.mouseMoveLeft)
              this.$refs.box.addEventListener('mouseup', this.mouseUpLeft)
          },
          mouseMoveLeft(ev){
              this.leftWhite = ev.clientX - this.muX
          },
          mouseUpLeft(e){
              this.$refs.box.removeEventListener('mousemove', this.mouseMoveLeft)
              this.$refs.box.removeEventListener('mouseup', this.mouseUpLeft)
          },
          addProject(){
              if (!this.newProjectName){
                  return
              }
              this.items.push({
                  id: this.uuid(),
                  name: this.newProjectName
              })
              this.ser.put("api", {
                  apiKey: "list",
                  content: this.items
              }).then(res => {
                  this.showNewProject = false
              })
          },
          addGroup(project){
              if (!this.newGroupName){
                  return
              }
              if (!project.items){
                  project.items = []
              }
              project.items.push({
                  id: "GROUP:" + this.uuid(),
                  name: this.newGroupName
              })
              this.ser.put("api", {
                  apiKey: "list",
                  content: this.items
              }).then(res => {
                  this.showNewGroup = false
              })
          },
          addApi(group){
              if (!this.newApiName){
                  return
              }
              if (!group.items){
                  group.items = []
              }
              let id = "API:" + this.uuid()
              group.items.push({
                  id: id,
                  name: this.newApiName
              })
              this.ser.put("api", {
                  apiKey: "list",
                  content: this.items
              }).then(res => {
                  this.showNewApi = false
              })
              this.ser.put("api", {
                  apiKey: "INFO:" + id,
                  content: {
                      name: this.newApiName,
                      method: 'GET',
                      tab: null,
                      url: '',
                      docParams: [{
                          name: '',
                          type: '字符串',
                          require: false,
                          description: ''
                      }],
                      headers: [{
                          name: '',
                          value: '',
                          description: ''
                      }],
                      responseBody: '',
                      requestBody: ''
                  }
              })
              this.selectApi(id)
          },
          selectApi(id){
              this.isSelectApi = true
              this.selectApiId = id
              this.$router.replace({
                  path: '/api',
                  query: {
                      id: id
                  }
              })
          },
          deleteApi(group, i){
              let api = group[i]
              if (this.selectApiId === api.id){
                  this.isSelectApi = false
              }
              group.splice(i, 1)
              this.ser.put("api", {
                  apiKey: "list",
                  content: this.items
              })
          }
      },
      watch: {
      },
      created() {
        this.ser.get("api?key=" + "list").then(res => {
            if (!res || !res.length){
                this.items = []
            }else{
                this.items = res;
            }
        })

      }
  }
</script>
