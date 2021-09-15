<template>
    <v-container fluid>
        <h3 v-text="name"></h3>
        <v-btn elevation="2" small color="primary" style="margin-left: 10px; float: right; margin-top: -30px" @click="doRequest">Save</v-btn>
        <v-row align="center">
            <v-col
                class="d-flex"
                sm="3"
            >
                <v-select
                    :items="methods"
                    label="请求方法"
                    v-model="method"
                ></v-select>
            </v-col>
            <v-text-field label="请求地址" v-model="url"></v-text-field>
            <v-btn elevation="2" small color="primary" style="margin-left: 10px; margin-right: -70px" @click="doRequest">Send</v-btn>
        </v-row>

        <v-row align="center" style="margin-top: -30px">
            <v-tabs v-model="tab">
                <v-tab>参数文档</v-tab>
                <v-tab>Header</v-tab>
                <v-tab>Body</v-tab>
            </v-tabs>
        </v-row>
        <v-row>
            <v-tabs-items v-model="tab" style="padding: 10px;width: 100%">
                <v-tab-item key="参数文档">
                    <div class="param-header">
                        <div class="param-item" style="width: 200px">参数</div>
                        <div class="param-item" style="width: 135px">类型</div>
                        <div class="param-item" style="width: 80px">必填</div>
                        <div class="param-item" style="width: calc(100% - 435px)">描述</div>
                        <div class="param-item" style="width: 25px">···</div>
                    </div>
                    <div class="param-header" v-for="(item, i) in docParams">
                        <div class="param-item" style="width: 200px"><input v-model="item.name"/></div>
                        <div class="param-item" style="width: 135px"><select v-model="item.type">
                            <option v-for="option in types">
                                {{option}}
                            </option>
                        </select></div>
                        <div class="param-item" style="width: 80px">
                            <v-switch v-model="item.require" style="height: 31px"/>
                        </div>
                        <div class="param-item" style="width: calc(100% - 435px)">
                            <input v-model="item.description"/>
                        </div>
                        <div class="param-item work" @click="addOrRemoveParams(i)">
                            {{ (i === 0 && docParams.length === 1 || i === docParams.length - 1) ? '+' : '-'}}
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item  key="Header">
                    <div class="param-header">
                        <div class="param-item" style="width: 200px">参数</div>
                        <div class="param-item" style="width: 200px">值</div>
                        <div class="param-item" style="width: calc(100% - 425px)">描述</div>
                        <div class="param-item" style="width: 25px">···</div>
                    </div>
                    <div class="param-header" v-for="(item, i) in headers">
                        <div class="param-item" style="width: 200px"><input v-model="item.name"/></div>
                        <div class="param-item" style="width: 200px"><input v-model="item.value"/></div>
                        <div class="param-item" style="width: calc(100% - 425px)">
                            <input v-model="item.description"/>
                        </div>
                        <div class="param-item work" @click="addOrRemoveHeaders(i)">
                            {{ (i === 0 && headers.length === 1 || i === headers.length - 1) ? '+' : '-'}}
                        </div>
                    </div>
                </v-tab-item>

                <v-tab-item key="Body">
                    <h3>Request</h3>
                    <codemirror v-model="requestBody" :options="cmOptions"></codemirror>
                </v-tab-item>
            </v-tabs-items>
        </v-row>
        <v-row>
            <div class="response">
                <h3>Response</h3>
                <codemirror v-model="responseBody" :options="requestOptions"></codemirror>
            </div>
        </v-row>
    </v-container>
</template>

<script>
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
export default {
    name: "ApiEdit",
    data(){
        return {
            methods:[
                'GET', 'POST', 'PUT', 'DELETE'
            ],
            types: [
                '字符串', '整数', '小数', '日期时间', '布尔值', '对象'
            ],
            name: '',
            method:'GET',
            url: 'http://localhost:8080/api/v1/model/base',
            tab: null,
            docParams: [
                {
                    name: '',
                    type: '字符串',
                    require: false,
                    description: ''
                }
            ],
            headers: [
                {
                    name: '',
                    value: '',
                    description: ''
                }
            ],
            cmOptions: {
                tabSize: 2,
                mode: 'application/json',
                theme: 'monokai',
                lineNumbers: true,
                line: true,
            },
            requestOptions: {
                tabSize: 2,
                mode: 'text/javascript',
                theme: 'monokai',
                lineNumbers: true,
                line: true,
            },
            responseBody: '',
            requestBody: ''
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        save(){
            let data = {
                name: this.name,
                method: this.method,
                tab: this.tab,
                url: this.url,
                docParams: this.docParams,
                headers: this.headers,
                responseBody: this.responseBody,
                requestBody: this.requestBody
            }
            this.ser.put("api", {
                apiKey: "INFO:" + this.$route.query.id,
                content: data
            })
        },
        load(){
            this.ser.get("api?key=INFO:" + this.$route.query.id).then(res => {
                this.name = res.name ? res.name : '未命名文档'
                this.method = res.method ? res.method : 'GET'
                this.tab = res.tab ? res.tab : null
                this.url = res.url ? res.url : ''
                this.docParams = res.docParams ? res.docParams : [{
                    name: '',
                    type: '字符串',
                    require: false,
                    description: ''
                }]
                this.headers = res.headers ? res.headers : [{
                    name: '',
                    value: '',
                    description: ''
                }]
                this.responseBody = res.responseBody ? res.responseBody: ''
                this.requestBody = res.requestBody ? res.requestBody : ''
            })
        },
        addOrRemoveParams(index){
            if (index === 0 && this.docParams.length === 1 || index === this.docParams.length - 1){
                this.docParams.push({
                    name: '',
                    type: '字符串',
                    require: false,
                    description: ''
                })
            }else{
                this.docParams.splice(index, 1)
            }
        },
        addOrRemoveHeaders(index){
            if (index === 0 && this.headers.length === 1 || index === this.headers.length - 1){
                this.headers.push({
                    name: '',
                    value: '',
                    description: ''
                })
            }else{
                this.headers.splice(index, 1)
            }
        },
        doRequest(){
            let xhr = new XMLHttpRequest()
            let data = {}

            // 响应信息
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4){
                    this.responseStatus = xhr.status
                    this.responseBody = JSON.stringify(JSON.parse(xhr.responseText), null, 2);
                    this.save()
                }
            }
            xhr.open(this.method, this.url, false);

            // 请求头
            for (let i in this.headers){
                let head = this.headers[i];
                if (head && head.value && head.name){
                    xhr.setRequestHeader(head.name, head.value);
                }
            }

            if (this.method === 'GET'){
                xhr.send()
            }else{
                // 请求体
                data = JSON.parse(this.requestBody)
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.send(JSON.stringify(data))
            }
        }
    },
    watch: {
        $route:{
            deep: true,
            immediate: true,
            handler(to, form){
                this.load()
            }
        }
    }
}
</script>

<style scoped lang="less">
    .param-header{
        .param-item{
            text-align: left;
            display: inline-block;
            border: 1px solid #d4d4d4;
            margin-left: -1px;
            margin-top: -1px;
            padding: 0 5px;
            height: 27px;
            vertical-align: top;
            //overflow: hidden;

            input, select{
                outline: none;
                width: 100%;
            }
            .v-input--selection-controls{
                margin-top: -5px;
            }
            .input__slot{
                margin-bottom: 0!important;
            }
        }

        .param-item.work{
            width: 25px;
            text-align: center;
        }
        .param-item.work:hover{
            background-color: #ececec;
        }

        .v-input--is-label-active{
            margin-top: -6px;
            padding-top: 6px;
        }
        .v-input__slot{
            margin-bottom: 0;
        }
        .v-messages.theme--light.primary--text{
            display: none;
        }
    }
    .response{
        padding: 10px;
        width: 100%;
        .vue-codemirror{
            width: 100%;
        }
    }
</style>
