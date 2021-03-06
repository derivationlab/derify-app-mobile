<template>
  <div class="home-container page-container">
    <navbar :title="$t('Trade.BrokerBind.BrokerCodes.BindBrokerPrivilege')" :logo="false" :showGoback="false"/>
    <div class="home-mid">
      <DerifyErrorNotice :show="showError" @close="errorNotice">
        {{errorMsg}}
      </DerifyErrorNotice>
      <van-list class="brokers-wrap"
                :v-model="loading"
                @load="loadBrokers"
                :finished="finished"
                :loading-text="$t('global.Loading')"
      >
        <template v-for="(broker,key) in brokers">
          <div :class="broker.id === selectedBroker.id ? 'broker-info active' : 'broker-info'" :key="key" @click="() => {
              if(selectedBroker === broker) {
                selectedBroker = {}
              }else{
                selectedBroker = broker
              }
            }">
            <i class="selected-icon" v-if="broker.id === selectedBroker.id">
              <img src="@/assets/images/wallet/select.png" alt="" style="width: 100%;height: 100%;"/>
            </i>

            <div class="broker-avatar">
              <van-image fit="cover" radius="2.5rem" :src="broker.logo" width="5rem" height="5rem" alt=""/>
            </div>
            <div class="broker-contact">
              <div class="broker-name">{{broker.name}}</div>
              <div class="broker-addr">
                <p>@{{broker.id}}</p>
              </div>
              <div>
                <p>
                  <template v-if="countLength(broker.introduction) > 72">
                    <span>{{broker.showAllIntrudct ? broker.introduction : (cutLength(broker.introduction, 72)+"...")}}</span>
                    <span  class="fc-yellow" @click='() => {broker.showAllIntrudct = !broker.showAllIntrudct}'>{{broker.showAllIntrudct ? $t("Broker.Broker.InfoEdit.PackUp") : $t("Broker.Broker.InfoEdit.SeeMore")}}</span>
                  </template>
                  <template v-else>
                    {{broker.introduction}}
                  </template>
                </p>
              </div>
            </div>
          </div>
        </template>
      </van-list>
    </div>
    <div class="home-last">
      <ButtonLoginWrap className="derify-big-btn btn-yellow">
        <p class="code-wrap"><span class="fc-yellow" @click="() => this.$emit('onSwitch')">{{$t("Trade.BrokerBind.BrokerBind.HaveBrokerCode")}}</span></p>
        <div class="derify-big-btn btn-yellow" @click="bindBroker">{{ $t('Broker.Broker.InfoEdit.Commit') }}</div>
      </ButtonLoginWrap>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'
import ButtonLoginWrap from '@/components/ButtonLoginWrap/ButtonLoginWrap'
import TextView from '@/components/TextView'
import {countLength,cutLength} from '@/utils/utils'

export default {
  name: 'Home',
  components: {
    DerifyErrorNotice,
    ButtonLoginWrap,
    Navbar
  },
  data () {
    return {
      loading: false,
      finished: true,
      brokers: [],
      selectedBroker: {},
      brokerPageSize: 9,
      brokerPageNum: 0,
      showError: false,
      errorMsg: ''
    }
  },
  created () {
    this.loadBrokers()
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    },
    trader () {
      return this.$store.state.user.selectedAddress;
    }
  },
  methods: {
    countLength,cutLength,
    loadBrokers() {

      if(this.loading){
        return;
      }

      this.loading = true
      this.$store.dispatch('broker/getBrokerList', {page: this.brokerPageNum, size: this.brokerPageSize})
        .then((brokers) => {
        if(brokers.length < 1) {
          this.finished = true
        }else{
          brokers.forEach(broker => {
            this.brokers.push(Object.assign({selected: false, showAllIntr: false}, broker))
          })
          this.finished = false
        }
      }).finally(() => {
        this.loading = false
      })

      this.brokerPageNum++
    },
    bindBroker () {

      if(!this.selectedBroker || !this.selectedBroker.id) {
        this.errorNotice(this.$t('Trade.BrokerBind.BrokerCodes.SelectOrInputBrokerId'))
        return
      }

      this.$store.dispatch('user/bindBroker', {trader: this.trader, brokerId: this.selectedBroker.id})
        .then((data) => {
          if(data.success){
            this.$store.dispatch("user/initWallet").then(() => {
              this.$events.$emit('afterInitWallet');
            });

          }else{
            this.errorNotice(data.msg)
          }
        }).catch(e => {
        this.$toast(e)
      })
    },
    errorNotice(msg){
      if(msg){
        this.errorMsg = msg
        this.showError = true
      }else{
        this.showError = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.selected-icon{
  width: 2rem;
  height: 2rem;
}

.page-container{
  background: #140B32;
}

.home-mid{
  height: 57rem;
  overflow-y: scroll;
  .broker-info{
    margin: 1.5rem 0;
    position: relative;
    box-sizing: content-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1.1rem;
    border-radius: 1.8rem;
    background-color: #272354;
    border: 0.1rem solid transparent;
    &.active{
      border: 0.1rem solid #fae247;
    }
    .selected-icon{
      position: absolute;
      right: 1rem;
      top: 1rem;
    }
    .broker-avatar {
      padding: 1.1rem;
      img{
        width: 5.5rem;
        height: 5.5rem;
        border-radius: 2.5rem;
      }
    }

    .broker-contact {
      overflow: hidden;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
      color: rgba(255,255,255,0.45);
      font-size: 1.3rem;
      line-height: 1.8rem;
      .broker-name{
        font-size: 1.7rem;
        font-weight: Bold;
        text-align: LEFT;
        color: #ffffff;
      }
    }
  }
}

.home-last {
  position: fixed;
  bottom: 1rem;
  left: 0;
  width: 100%;
  align-items: center;
  padding: 2rem;
  p {
    text-align: center;
    margin: 1rem;
    .fc-yellow{
      border-bottom: 0.1rem solid @orange;
    }
  }
}

</style>
