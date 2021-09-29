<template>
  <div class="home-container page-container">
    <navbar :logo="true" :title="$t('Trade.navbar.Home')" />

    <div class="home-content">
      <div class="home-top">
        <div class="home-top-left">
          <div class="home-top-coin" @click="changeShowMarket(true)">
            <span class="home-top-coin-name">{{curPair.name}}</span>
            <van-icon color="rgba(255, 255, 255, .85)" name="arrow" size="1.6rem"></van-icon>
          </div>
          <div class="home-top-num">
            <span :class="curContractData.tokenPriceRate >= 0 ? 'fc-green' : 'fc-red'">
              <DecimalView :value="curSpotPrice | fck(-8,2)" last-style="font-size: 1.5rem"/>
            </span>
          </div>
          <div :class="curContractData.tokenPriceRate >= 0 ? 'home-top-percent up' : 'home-top-percent down'"><span>
          {{curContractData.tokenPriceRate}}%</span>
          </div>
        </div>
        <div class="home-top-right">
          <div class="home-top-icons" v-if="$route.name === 'home'">
            <img src="@/assets/icons/icon-k.png" alt="" class="home-top-icon" @click="changeRouter('exchange')">
          </div>
          <div class="home-top-items">
            <span class="fc-65">{{$t('Trade.OpenPosition.Kline.PCFRate')}}</span>
            <img @click="changeShowHint(true, 'key4')" class="left-help-icon" src="@/assets/icons/icon-help.png" alt="">:
            <span :class="curPositionChangeFeeRatio > 0 ? 'fc-green' : 'fc-red'">{{curPositionChangeFeeRatio | amountFormt(4, true, 0, -6)}}%</span>
          </div>
          <div class="home-top-items">
            <span class="fc-65">{{$t('Trade.OpenPosition.Kline.PMAPY')}}</span>
            <img @click="changeShowHint(true, 'key4')" class="left-help-icon" src="@/assets/icons/icon-help.png" alt="">:
            <span class="fc-green">{{$t('Trade.OpenPosition.Kline.Long')}}</span>
            <span>{{curContractData.longPmrRate | fck(0,2)}}%</span>
            <span class="fc-65 margin">/</span>
            <span class="fc-red">{{$t('Trade.OpenPosition.Kline.Short')}}</span>
            <span>{{curContractData.shortPmrRate | fck(0,2)}}%</span>
          </div>
        </div>
      </div>
      <template v-if="$route.name === 'home'">
        <div class="home-mid">
          <div class="home-mid-one">
            <van-dropdown-menu :overlay="false" class="derify-dropmenu">
              <van-dropdown-item class="derify-dropmenu-item-wrap" v-model="entrustType" :options="entrustTypeConfig" @input="onOpenTypeChange">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{entrustTypeConfig[entrustType].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
              </van-dropdown-item>
            </van-dropdown-menu>
            <van-dropdown-menu :overlay="false" class="derify-dropmenu">
              <van-dropdown-item class="derify-dropmenu-item-wrap" v-model="leverageUnit" :options="leverageConfig" @input="updateTraderOpenUpperBound">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{leverageConfig[leverageUnit].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
          <div class="home-mid-two">
            <div class="fc-65 fz-12">{{$t('Trade.OpenPosition.OpenPage.Price')}}</div>
            <div class="home-mid-input" v-if="entrustType === 0">
              <van-field class="derify-input" type="text" input-align="center" disabled :value="$t('Trade.OpenPosition.OpenPage.MarketPrice')" />
            </div>
            <div class="home-mid-input" v-else>
              <van-field class="derify-input" type="text" v-model.number="amount" :formatter="(value) => {
                value = value.replace(/-/g, '')
                return value
              }" @change="updateTraderOpenUpperBound"/>
              <div class="fc-30">USDT</div>
            </div>
          </div>
          <div class="home-mid-two">
            <div class="home-mid-two-title">
              <div class="fc-65 fz-12">{{$t('Trade.OpenPosition.OpenPage.Amount')}}</div>
              <div class="fz-12">
            <span class="fc-65">{{$t('Trade.OpenPosition.OpenPage.Max')}}：
              <!-- USDT -->
              <template v-if="unit === UnitTypeEnum.USDT">{{maxSize}} USDT</template>
              <!-- curToken -->
              <template v-if="unit === UnitTypeEnum.CurPair">{{maxSize}} {{curPair.key}}</template>
              <!-- percent -->
              <template v-if="unit === UnitTypeEnum.Percent">{{maxSize}} {{curPair.key}}</template></span>
                <span class="fc-yellow" @click="transfer">{{$t('Trade.OpenPosition.OpenPage.Transfer')}}</span>
              </div>
            </div>
            <div class="home-mid-input">
              <van-field class="derify-input" type="number" :formatter="(value) => {
                value = value.replace(/-/g, '')
                return value
              }" v-model.number="size" @input="onPositionSizeChange"/>
              <van-dropdown-menu :overlay="false" class="derify-dropmenu no-border">
                <van-dropdown-item class="derify-dropmenu-item-wrap" v-model="unit" :options="unitConfig"  @change="unitSelectChange">
                  <div class="derify-dropmenu-title" slot="title">
                    <span>{{unitConfig[unit].text}}</span>
                    <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                  </div>
                </van-dropdown-item>
              </van-dropdown-menu>
            </div>
          </div>
          <div class="home-mid-three">
            <van-slider bar-height=".8rem" button-size="1.8rem" v-model="sliderValue" @input="onSliderValueChange"/>
          </div>
          <div class="home-mid-four" v-if="isLogin">
            <div class="home-mid-four-btn green-gra" @click="changeShowOpen(true, 0)">{{$t('Trade.OpenPosition.OpenPage.BuyLong')}}</div>
            <div class="home-mid-four-btn red-gra" @click="changeShowOpen(true, 1)">{{$t('Trade.OpenPosition.OpenPage.SellShort')}}</div>
            <div class="home-mid-four-btn yellow-gra" @click="changeShowOpen(true, 2)">{{$t('Trade.OpenPosition.OpenPage.TwoWay')}}</div>
          </div>
          <div class="home-mid-four" v-if="!isLogin">
            <div class="home-mid-four-btn yellow-gra" @click="$loginWallet()">{{$t('Trade.Wallet.ConnectWallet')}}</div>
          </div>
        </div>
      </template>
      <div class="k-chart-wrap" :style="{display: $route.name === 'exchange' ? 'block' : 'none'}">
        <div class="k-chart-xtype-list">
          <template v-for="(gap,key) in kChartTimeMinGaps">
            <template v-if="key <= showTimeGapNum">
              <div :key="key"
                   :class="gap.value === kChartTimeGap.value ? 'k-chart-xtype xtype-active' : 'k-chart-xtype'"
                   @click="changeKChartTimeGap(gap)"
              >{{gap.text}}</div>
            </template>
          </template>
          <div class="k-chart-xtype last-xtype" v-if="kChartTimeMinGaps.length > showTimeGapNum" @click="toggleTimeGap(!showTimeGapDropDown)">
            <svg v-if="!showTimeGapDropDown" t="1628433867256" class="arrow-down-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2971" width="200" height="200"><path d="M482.133333 738.133333L136.533333 392.533333c-17.066667-17.066667-17.066667-42.666667 0-59.733333 8.533333-8.533333 19.2-12.8 29.866667-12.8h689.066667c23.466667 0 42.666667 19.2 42.666666 42.666667 0 10.666667-4.266667 21.333333-12.8 29.866666L541.866667 738.133333c-17.066667 17.066667-42.666667 17.066667-59.733334 0z" p-id="2972" fill="#ADAAB7"></path></svg>
            <svg v-else t="1628434121366" class="arrow-up-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3272" width="200" height="200"><path d="M541.866667 285.866667l345.6 345.6c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-19.2 12.8-29.866667 12.8H168.533333c-23.466667 0-42.666667-19.2-42.666666-42.666667 0-10.666667 4.266667-21.333333 12.8-29.866666l343.466666-345.6c17.066667-17.066667 42.666667-17.066667 59.733334 0z" p-id="3273" fill="rgba(255,255,255,0.85)"></path></svg>
          </div>
        </div>
        <div v-if="showTimeGapDropDown" class="k-chart-dropdown">
          <template v-for="(gap,key) in kChartTimeMinGaps">
            <template v-if="key > showTimeGapNum">
              <div :key="key"
                   :class="gap.value === kChartTimeGap.value ? 'k-chart-dropdown-item xtype-active' : 'k-chart-dropdown-item'"
                   @click="changeKChartTimeGap(gap)"
              >{{gap.text}}</div>
            </template>
          </template>
        </div>
        <div id="myChart" class="k-chart-ctn" :style="{width: '100%', height: '36.5rem'}"></div>
      </div>
      <div class="home-last">
        <template v-if="$route.name === 'home'">
          <van-tabs v-model="active" @click="tabChange">
            <van-tab v-for="(value, key) in tabs" :key="key" :name="key" :title="value">
              <van-list
                v-model="loading"
                :loading-text="$t('global.Loading')"
                :finished="finished"
                @load="onLoad"
              >

                <template v-if="active === 'key1'">
                  <template  v-for="(data,i) in positions">
                    <div class="exchange-block" v-if="data.isUsed" :key="i">
                      <div class="exchange-block-title">
                        <div class="left">

                          <div v-if="data.side === SideEnum.LONG" class="mr-4 text-icon-green">{{$t('Trade.MyPosition.List.Long')}}</div>
                          <div v-if="data.side === SideEnum.SHORT" class="mr-4 text-icon-red">{{$t('Trade.MyPosition.List.Short')}}</div>
                          <div class="fz-16 mr-4">{{getPairByAddress(data.token).name}}</div>
                          <div class="number-icon-green mr-4">{{data.leverage | fck(-8, 0)}}x</div>
                          <img @click="changeShowHint(true, active)" class="left-help-icon" src="@/assets/icons/icon-help.png" alt="">
                        </div>
                        <div class="right" v-if="active === 'key1'" @click="changeShowUnwind(true, data)">
                          <div class="fz-12 fc-yellow">{{$t('Trade.MyPosition.List.Close')}}</div>
                          <van-icon size="1.2rem" color="#FAE247" name="arrow"></van-icon>
                        </div>
                        <div class="right" v-if="active === 'key2'" @click="changeClosePosistionStatus(true, data)">
                          <div class="fz-12 fc-yellow">{{$t('Trade.CurrentOrder.List.Cancel')}}</div>
                          <van-icon size="1.2rem" color="#FAE247" name="arrow"></van-icon>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.UnrealizedPnL')}}：</div>

                          <div :class="data.unrealizedPnl > 0 ? 'fc-green' : 'fc-red'">
                            {{data.unrealizedPnl | amountFormt(2, true, '--', -8)}}
                          </div>
                          <div>USDT<template><span :class="data.returnRate > 0 ? 'fc-green' : 'fc-red'">({{data.returnRate|amountFormt(2, true, '--', -6)}}%)</span></template></div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.PositionHeld')}}：</div>
                          <div>{{data.size | fck(-8, 4)}} {{getPairByAddress(data.token).key}}</div>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.CurrentPrice')}}：</div>
                          <div>{{data.spotPrice | fck(-8)}} USDT</div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.AveragePrice')}}：</div>
                          <div>{{data.averagePrice | fck(-8)}} USDT</div>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.StopLoss')}}：</div>
                          <div>
                            <template v-if="data.stopLossPrice > 0">{{data.stopLossPrice | fck(-8)}}</template>
                            <template v-else>--</template></div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.TP')}}：</div>
                          <div><template v-if="data.stopProfitPrice > 0">{{data.stopProfitPrice | fck(-8)}}</template>
                            <template v-else>--</template></div>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.Margin')}}：</div>
                          <div>{{data.margin | amountFormt(2, false, '--', -8)}} USDT</div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.Risk')}}：</div>
                          <div>{{data.marginRate | amountFormt(2, false, '--', -6)}}%</div>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.MyPosition.List.LiqPrice')}}：</div>
                          <div>{{data.liquidatePrice | amountFormt(2, false, '--', -8)}} USDT</div>
                        </div>
                        <div class="exchange-item-right" @click="changeShowSet(true, data)">
                          <div class="fc-yellow">{{$t('Trade.MyPosition.List.SetTPSL')}}</div>
                          <van-icon size="1.2rem" color="#FAE247" name="arrow"></van-icon>
                        </div>
                      </div>
                    </div>
                  </template>

                </template>
                <template v-if="active ==='key2'">
                  <template  v-for="(data,i) in positionOrders">
                    <div class="exchange-block" v-if="data.isUsed" :key="i">
                      <div class="exchange-block-title">
                        <div class="left">

                          <div v-if="data.side === 0" class="mr-4 text-icon-green">{{$t('Trade.CurrentOrder.List.L')}}</div>
                          <div v-if="data.side === 1" class="mr-4 text-icon-red">{{$t('Trade.CurrentOrder.List.S')}}</div>
                          <div class="fz-16 mr-4">{{getPairByAddress(data.token).name}}</div>
                          <div class="number-icon-green mr-4">{{data.leverage | fck(-8, 0)}}x</div>
                          <img @click="changeShowHint(true, active)" class="left-help-icon" src="@/assets/icons/icon-help.png" alt="">
                        </div>
                        <div class="right" v-if="active === 'key2'" @click="changeClosePosistionStatus(true, data)">
                          <div class="fz-12 fc-yellow">{{$t('Trade.CurrentOrder.List.Cancel')}}</div>
                          <van-icon size="1.2rem" color="#FAE247" name="arrow"></van-icon>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.CurrentOrder.List.Price')}}：</div>
                          <template v-if="data.orderType === OrderTypeEnum.LimitOrder"><div>{{data.price | fck(-8)}} USDT</div></template>
                          <template v-else><div>{{data.stopPrice | fck(-8)}} USDT</div></template>


                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.CurrentOrder.List.Type')}}：</div>
                          <template v-if="data.orderType === OrderTypeEnum.LimitOrder">
                            <div>
                              <span>{{$t('Trade.CurrentOrder.List.OpenLimit')}}</span>
                            </div>
                          </template>
                          <template v-if="data.orderType === OrderTypeEnum.StopProfitOrder">
                            <div><span>{{$t('Trade.CurrentOrder.List.CloseTP')}}</span></div></template>
                          <template v-if="data.orderType === OrderTypeEnum.StopLossOrder">
                            <div><span>{{$t('Trade.CurrentOrder.List.CloseSL')}}</span></div></template>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.CurrentOrder.List.Volume')}}：</div>
                          <div>{{data.size | fck(-8,4)}} {{getPairByAddress(data.token).key}}</div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.CurrentOrder.List.Time')}}：</div>
                          <div>{{new Date(data.timestamp * 1000).Format("yyyy-MM-dd hh:mm:ss")}}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="active ==='key3'">
                  <template  v-for="(data,i) in tradeRecords">
                    <div class="exchange-block" :key="i">
                      <div class="exchange-block-title">
                        <div class="left">

                          <div v-if="data.side === SideEnum.LONG" class="mr-4 text-icon-green">{{$t('Trade.TradeHistory.List.Long')}}</div>
                          <div v-if="data.side === SideEnum.SHORT" class="mr-4 text-icon-red">{{$t('Trade.TradeHistory.List.Short')}}</div>
                          <div class="fz-16 mr-4">{{getPairByAddress(data.token).name}}</div>
                          <img @click="changeShowHint(true, active)" class="left-help-icon" src="@/assets/icons/icon-help.png" alt="">
                        </div>
                        <div class="fz-12 fc-45">{{new Date(data.event_time).Format("yyyy-MM-dd hh:mm:ss")}}</div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.RealizedPnL')}}：</div>
                          <div :class="data.pnl_usdt > 0 ? 'fc-green' : 'fc-red'">{{data.pnl_usdt | amountFormt(2, true, '--')}} USDT</div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.Type')}}：</div>
                          <div>
                            <span :class="getTradeType(data.type).showType">{{$t(getTradeType(data.type).tradeType + "1")}}</span><span>{{$t(getTradeType(data.type).tradeType + "2")}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.Price')}}：</div>
                          <div>{{data.price | amountFormt(2, false, '--')}} USDT</div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.Volume')}}：</div>
                          <div>{{data.size | amountFormt(4, false, '--')}} {{getPairByAddress(data.token).key}}</div>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.Amount')}}：</div>
                          <div>{{data.amount | amountFormt(2, false, '--')}} USDT</div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.TradFee')}}：</div>
                          <div>{{-data.trading_fee | amountFormt(2, false, '--')}} USDT</div>
                        </div>
                      </div>
                      <div class="exchange-item">
                        <div class="exchange-item-left">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.PCF')}}：</div>
                          <div>{{-data.position_change_fee  | amountFormt(2, false, '--')}} USDT</div>
                        </div>
                        <div class="exchange-item-right">
                          <div class="fc-45">{{$t('Trade.TradeHistory.List.Compensation')}}：</div>
                          <div>{{data.pnl_bond  | amountFormt(2, false, '--')}} bDRF</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>

              </van-list>
            </van-tab>
          </van-tabs>
        </template>
        <div class="home-last-btn-wrap">
          <template v-if="$route.name === 'exchange'">
            <template v-if="isLogin">
              <div class="home-last-four-btn green-gra" @click="changeRouter('home')">{{$t('Trade.OpenPosition.OpenPage.BuyLong')}}</div>
              <div class="home-last-four-btn red-gra" @click="changeRouter('home')">{{$t('Trade.OpenPosition.OpenPage.SellShort')}}</div>
            </template>
          </template>
          <template v-if="$route.name === 'home' && (active === 'key1' || active === 'key2')">
            <template v-if="isLogin">
              <template v-if="active === 'key1' && positions.length > 0">
                <div class="home-last-batch-btn base-bg-color" @click="changeShowOneKeyUnwind(true)">{{$t('Trade.MyPosition.List.OneClickClose')}}</div>
              </template>

              <template v-if="active === 'key2' && positionOrders.length > 0">
                <div class="home-last-batch-btn base-bg-color" @click="changeClosePosistionStatus(true)">{{$t('Trade.CurrentOrder.List.CancelAll')}}</div>
              </template>
            </template>
          </template>
        </div>
      </div>
    </div>

    <market :show="showMarket" @closeMarketPopup="changeShowMarket" />
    <hint :show="showHint" :type="hintType" @closeHintPopup="changeShowHint" />
    <set-popup :extraData="setExtraData" :show="showSet" @closeSetPopup="changeShowSet" />
    <unwind :extraData="unwindExtraData" :show="showUwind" @closeUnwindPopup="changeShowUnwind" />
    <one-key-unwind :show="showOneKeyUnwind" @closeOneKeyUnwindPopup="changeShowOneKeyUnwind" />
    <open :extraData="openExtraData" :show="showOpen" :type="openType" @closeOpenPopup="changeShowOpen" />
    <open-status :show="showOpenStatus" :type="openStatus" @closeOpenStatusPopup="changeShowOpenStatus" />
    <close-position :show="showClosePositionWind" :extraData="extClosePositionData" :closePositionOrderType="closePositionOrderType" @onClosePosition="changeClosePosistionStatus"/>
    <DerifyErrorNotice class="home-error" :show="showError" @close="() => this.showError=false">
      {{errorMsg}}
    </DerifyErrorNotice>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Market from './Popup/Market'
import Hint from './Popup/Hint'
import SetPopup from './Popup/Set'
import Unwind from './Popup/Unwind'
import OneKeyUnwind from './Popup/OneKeyUnwind'
import Open from './Popup/Open'
import OpenStatus from '../../components/UserProcessBox/OpenStatus'
import { createTokenMiningFeeEvenet, createTokenPriceChangeEvenet } from '@/api/trade'
import {
  fromContractUnit, numConvert,
  OpenType, OrderTypeEnum,
  Position,
  SideEnum,
  stringFromContractUnit,
  toContractUnit
} from '@/utils/contractUtil'
import {fck} from "@/utils/utils";
import { CancelOrderedPositionTypeEnum, UnitTypeEnum } from '@/utils/contractUtil'
import { UserProcessStatus } from '@/store/modules/user'
import ClosePosition from './Popup/ClosePosition'
import { EVENT_WALLET_CHANGE } from '@/utils/web3Utils'
import getEchartsOptions, { buildEchartsOptions } from '../../utils/kline'
import DecimalView from '../../components/DecimalView/DecimalView'
import { convertAmount2TokenSize, toContractNum } from '../../utils/contractUtil'
import DerifyErrorNotice from '../../components/DerifyErrorNotice/DerifyErrorNotice'
class OpTypeEnum {
  constructor(opType, opTypeDesc) {
    this.opType = opType
    this.opTypeDesc = opTypeDesc
  }
  static get OpenPosition() {
    return new OpTypeEnum(1, "Open")
  }

  static get ClosePosition() {
    return new OpTypeEnum(2, "Close")
  }
}

const context = {
  myChart: null,
  loaded: false,
  timer: null,
  klineTimer: null,
  loadStamp: 0,
  tokenMiningRateEvent: null,
  tokenPriceChangeEvenet: null
};

const TradeTypeMap = {
  0: {tradeType: 'Trade.TradeHistory.List.OpenMarket', opTypeEnum: OpTypeEnum.OpenPosition, showType: 'fc-green'},//-MarketPriceOpen
  1: {tradeType: 'Trade.TradeHistory.List.OpenMarket', opTypeEnum: OpTypeEnum.OpenPosition, showType: 'fc-green'},//-HedgeMarketPriceOpen
  2: {tradeType: 'Trade.TradeHistory.List.OpenLimit', opTypeEnum: OpTypeEnum.OpenPosition, showType: 'fc-green'},//-LimitPriceOpen
  3: {tradeType: 'Trade.TradeHistory.List.CloseTPSL', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'fc-red'},//-StopProfitClose
  4: {tradeType: 'Trade.TradeHistory.List.CloseTPSL', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'fc-red'},//-StopLossClose
  5: {tradeType: 'Trade.TradeHistory.List.CloseDeleverage', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'fc-red'},//-AutoDeleveragingClose
  6: {tradeType: 'Trade.TradeHistory.List.CloseLiquidate', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'fc-red'},//-MandatoryLiquidationClose
  7: {tradeType: 'Trade.TradeHistory.List.CloseMarket', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'fc-red'},//-SingleClose
  8: {tradeType: 'Trade.TradeHistory.List.CloseMarket', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'fc-red'},//-AllCloseHedgePart
  9: {tradeType: 'Trade.TradeHistory.List.CloseMarket', opTypeEnum: OpTypeEnum.ClosePosition, showType: 'fc-red'}//-AllCloseLeftPart
}

export default {
  name: 'Home',
  components: {
    DerifyErrorNotice,
    DecimalView,
    ClosePosition,
    Navbar,
    Market,
    Hint,
    SetPopup,
    Unwind,
    OneKeyUnwind,
    Open,
    OpenStatus
  },
  computed: {
    curPair () {
      const {curPairKey, pairs} = this.$store.state.contract
      return pairs.find(pair => pair.key === curPairKey)
    },
    curSpotPrice () {
      return this.$store.state.contract.contractData.curSpotPrice
    },
    curPositionChangeFeeRatio () {
      return this.$store.state.contract.contractData.positionChangeFeeRatio
    },
    curContractData () {
      return this.$store.state.contract.contractData
    },
    curTraderOpenUpperBound () {

      const traderOpenUpperBound = this.$store.state.contract.contractData.traderOpenUpperBound
      if(!traderOpenUpperBound){
        return {size : 0, amount: 0}
      }

      return traderOpenUpperBound
    },
    leverage () {
      return this.leverageConfig[this.leverageUnit].val
    },
    isLogin () {
      return this.$store.state.user.isLogin
    },
    finished () {
      if(this.active === 'key1') {
        return this.positionFinished
      }

      if(this.active === 'key2') {
        return this.positionOrdersFinished
      }

      if(this.active === 'key3') {
        return this.tradeRecordsFinished
      }

      return true
    },
    maxSize () {
      const {unit} = this
      if (unit ===  UnitTypeEnum.USDT) {
        return fromContractUnit(this.curTraderOpenUpperBound.amount, 2)
      }else{
        return fromContractUnit(this.curTraderOpenUpperBound.size, 2)
      }
    }
  },

  data () {

    const position = new Position()


    return {
      OrderTypeEnum,
      SideEnum,
      OpTypeEnum,
      UnitTypeEnum,
      errorMsg: '',
      showError: false,
      entrustType: 0,
      leverageUnit: 0,
      amount: fromContractUnit(this.curSpotPrice),
      size: null,
      sliderValue: 0,
      unit: 0,
      //curTraderOpenUpperBound: {size: 0, amount: 0},
      entrustTypeConfig: [
        {text:  this.$t('Trade.OpenPosition.OpenPage.Market'), value: 0},
        {text: this.$t('Trade.OpenPosition.OpenPage.Limit'), value: 1}
      ],
      leverageConfig: [
        {text: '10x', value: 0, val: 10},
        {text: '5x', value: 1, val: 5},
        {text: '3x', value: 2, val: 3},
        {text: '2x', value: 3, val: 2},
        {text: '1x', value: 4, val: 1}
      ],
      unitConfig: [
        {text: 'USDT', value: 0},
        {text: this.$store.state.contract.curPairKey, value: 1},
        {text: '%', value: 2}
      ],
      active: 'key1',
      tabs: {
        key1: this.$t('Trade.MyPosition.List.MyPosition'),
        key2:  this.$t('Trade.CurrentOrder.List.CurrentOrder'),
        key3:  this.$t('Trade.TradeHistory.List.TradeHistory')
      },
      showTimeGapDropDown: false,
      showTimeGapNum: 9,
      kChartTimeGap: {value: '15m', text: '15m'},
      kChartTimeMinGaps: [
        {value: '1m', text: '1m'},
        {value: '5m', text: '5m'},
        {value: '15m', text: '15m'},
        {value: '1H', text: '1h'},
        {value: '4H', text: '4h'},
        {value: '1D', text: 'D'},
        {value: '1W', text: 'W'},
        {value: '1M', text: 'M'},
      ],
      positions: [],
      positionOrders: [],
      tradeRecords: [],
      loading: false,
      positionFinished: true,
      positionOrdersFinished: true,
      tradeRecordsFinished: false,
      tradeRecordsPage: 0,
      showMarket: false, // market popup，change token pair
      showHint: false, // show hit popup
      hintType: 'key1', // show hit type
      showSet: false, // show stopPrift/stopLoss set popup
      showUwind: false, // show cancelPosition popup
      showOneKeyUnwind: false, // show one key cancelAllPosition popup
      showOpen: false, // show open position confirm popup
      openType: null, // open position type {@see OpenType}
      showOpenStatus: false, // smart contract processing popup type
      showClosePositionWind: false,
      closePositionOrderType: 0,
      extClosePositionData: {...position},
      openStatus: 'fail', // smart contract processing satus
      openExtraData: {
        entrustType: OpenType.MarketOrder,
        leverage: 10,
        amount: 0,
        size: 0,
        side: SideEnum.SHORT,
        leverageUnit: 0,
        unit: 0,
        positionChangeFee: 0,
        tradingFee: 0
      },
      positionChangeFeeRatio: 0,
      setExtraData: {...position},
      unwindExtraData: {...position}
    }
  },
  methods: {
    getTradeType (tradeType){
      const viewType = TradeTypeMap[tradeType]

      if(viewType) {
        return viewType
      }

      return {}
    },
    ClickBox () {
      this.show = true
    },
    changeShowMarket (bool) {
      this.showMarket = bool
    },
    changeShowHint (bool, type) {
      this.hintType = type
      this.showHint = bool
    },
    changeShowSet (bool, position) {
      this.showSet = bool

      if(!bool){
        return
      }

      this.setExtraData = {...position};

    },
    changeShowUnwind (bool, position) {
      this.showUwind = bool

      if(!bool){
        return
      }
      this.unwindExtraData = {...position}

    },
    changeShowOneKeyUnwind (bool) {
      this.showOneKeyUnwind = bool
    },
    /**
     * open position popup
     * @param bool
     * @param side
     */
    changeShowOpen (bool, side) {
      if (bool) {
        let {entrustType, leverage, leverageUnit, amount, size, unit} = this

        if (entrustType === 1 && !amount) {
          this.errorNotice(this.$t('global.NumberError'))
          return
        }

        if(entrustType === 0){
          amount = fromContractUnit(this.curSpotPrice)
        }

        if (!size || size <= 0) {
          this.errorNotice(this.$t('global.NumberError'))
          return
        }

        if(unit === UnitTypeEnum.CurPair){
          if (size > fromContractUnit(this.curTraderOpenUpperBound.size)) {
            this.errorNotice(this.$t('global.NumberError'))
            return
          }
        } else if(unit === UnitTypeEnum.USDT){
          if (size > fromContractUnit(this.curTraderOpenUpperBound.amount)) {
            this.errorNotice(this.$t('global.NumberError'))
            return
          }
        }

        let tradingFee = 0;
        let positionChangeFee = 0;

        if(side === SideEnum.HEDGE && entrustType === OpenType.LimitOrder){
          this.errorNotice(this.$t('Trade.OpenPosition.OpenPage.TwoWayOpenPriceTypeError'))
          return
        }

        if(entrustType === OpenType.LimitOrder) {
          if(side === SideEnum.LONG && amount >= fromContractUnit(this.curSpotPrice)){
            entrustType = OpenType.MarketOrder
            amount = fromContractUnit(this.curSpotPrice)
          }

          if(side === SideEnum.SHORT && amount <= fromContractUnit(this.curSpotPrice)){
            entrustType = OpenType.MarketOrder
            amount = fromContractUnit(this.curSpotPrice)
          }

        }

        if(UnitTypeEnum.Percent === unit) {
          unit = UnitTypeEnum.CurPair
          size = this.calculatePositionSize(unit, this.sliderValue)
        }

        this.openExtraData = Object.assign(this.openExtraData, {
          entrustType,
          leverage,
          amount: amount,
          size: size,
          side: side,
          leverageUnit,
          unit,
          positionChangeFee,
          tradingFee
        })

        let tokenSize = convertAmount2TokenSize(unit, toContractUnit(size), toContractUnit(amount))

        const self = this;
        this.$store.dispatch("contract/getTradingFee", {size: toContractNum(tokenSize), price: toContractNum(amount)}).then((tradingFee) => {
          if(!tradingFee) {
            return
          }
          Object.assign(this.openExtraData, {tradingFee: fromContractUnit(tradingFee)});
        });

        this.$store.dispatch("contract/getPositionChangeFee", {side: side, actionType: 0, size: toContractNum(tokenSize), price:toContractNum(amount)})
          .then((positionChangeFee) => {
            if(!positionChangeFee) {
              return
            }

            Object.assign(this.openExtraData, {positionChangeFee: fromContractUnit(positionChangeFee)});
          })
      }
      this.openType = side
      this.showOpen = bool
    },
    changeShowOpenStatus (bool, status) {
      this.openStatus = status
      this.showOpenStatus = bool
    },
    changeClosePosistionStatus (bool, data) {
      this.showClosePositionWind = bool

      const cancelOrderTypeMap = {}
      cancelOrderTypeMap[OrderTypeEnum.LimitOrder] = CancelOrderedPositionTypeEnum.LimitedOrder
      cancelOrderTypeMap[OrderTypeEnum.StopLossOrder] = CancelOrderedPositionTypeEnum.StopLossOrder
      cancelOrderTypeMap[OrderTypeEnum.StopProfitOrder] = CancelOrderedPositionTypeEnum.StopProfitOrder

      if(data && cancelOrderTypeMap.hasOwnProperty(data.orderType)){
        this.closePositionOrderType = cancelOrderTypeMap[data.orderType]
      }else{
        this.closePositionOrderType = CancelOrderedPositionTypeEnum.AllOrder
      }

      this.extClosePositionData = data

    },
    transfer () {
      this.$router.push({path: '/account'})
    },
    changeRouter (name) {
      if (this.$route.name === name) {
        return
      }
      this.$router.push({name})
    },
    drawKline (options) {
      if(this.$route.name !== 'exchange') {
        return
      }

      if(context.myChart !== null){
        context.myChart.dispose()
        context.myChart = null
      }

      if(!options) {
        options = {}
      }

      window.context = context

      context.myChart = this.$echarts.init(document.getElementById('myChart'))
      context.myChart.setOption(options)
      context.myChart.resize()
    },
    tabChange (key) {

      const self = this;

      if(key === 'key3'){
        self.loading = true
        self.loadTradeHistory(true)
      }else{
        this.$store.dispatch('contract/loadPositionData').then(r => {
          self.loading = false
        }).catch(()=>{
            self.loading = false
          })
          .finally(() => {
          self.loading = false
        })
      }
    },

    loadTradeHistory(truncate = false) {
      const self = this

      if(truncate) {
        this.tradeRecordsPage = 0
        this.tradeRecordsFinished =  false
      }

      this.$store.dispatch('contract/loadTradeRecords', {page: this.tradeRecordsPage}).then(r => {
        //@see TradeRecord
        this.loading = false
        if (!r) {
          this.tradeRecordsFinished = true
          return
        }

        this.tradeRecordsPage++
        if(truncate) {
          self.tradeRecords.splice(0)
        }

        r.forEach((item) => {
          if (item !== undefined || !isNaN(item)) {
            self.tradeRecords.push(item)
          }
        })

        self.loading = false
      })
    },

    onLoad () {
      const self = this
      const {active} = this
      if(active === 'key3'){
        self.loadTradeHistory(false)
      }else if(active === 'key1' || active === 'key2'){
        console.log(`${key} loadPositionData`)
        this.$store.dispatch('contract/loadPositionData').then(r => {
          self.loading = false
        }).finally(() => {
          self.positionFinished = true
          self.positionOrdersFinished = true
        })
      }
    },

    onOpenTypeChange () {
      if(!this.amount) {
        this.amount = fromContractUnit(this.curSpotPrice)
      }
      this.updateTraderOpenUpperBound()
    },
    onPositionSizeChange (size) {
      const {unit} = this
      const maxSize = this.getMaxSize(unit)
      if(size > maxSize) {
        this.size = maxSize
      }

      this.calculateSliderValue()
    },
    onSliderValueChange() {
      const {unit, sliderValue} = this// 0 ETH，1 USDT 2 %
      this.unit = UnitTypeEnum.Percent
      this.size = sliderValue
    },
    calculatePositionSize (unit, sliderValue) {

      let {size} = this
      const maxSize = this.getMaxSize(unit)
      if(maxSize > 0){
        size =  numConvert(sliderValue / 100 * this.getMaxSize(unit), 0, 2)
      }

      return size
    },
    getMaxSize(unit) {
      let maxSize = 100;
      if (unit !==  UnitTypeEnum.Percent) {
        maxSize = this.maxSize
      }

      return maxSize
    },
    calculateSliderValue () {
      const maxSize = this.getMaxSize(this.unit)
      if(maxSize > 0) {
        this.sliderValue = Math.min(Math.round(this.size * 100 / maxSize), 100)
      }
    },
    unitSelectChange (unit) {
      this.unit = unit;
      this.size = this.calculatePositionSize(unit, this.sliderValue)
    },
    updateTraderOpenUpperBound () {
      //leverage change, recalculate bound

      const openType = this.entrustType
      let amount = this.amount
      if(openType === OpenType.MarketOrder) {
        amount = fromContractUnit(this.curSpotPrice)
      }

      if(amount <= 0) {
        return
      }

      const price = toContractUnit(amount);

      const leverage = toContractUnit(this.leverage)

      this.$store.dispatch("contract/getTraderOpenUpperBound",
        {openType, price, leverage})
        .then(traderOpenUpperBound => {
          //this.calculatePositionSize(this.sliderValue)
      });
    },
    homeInit(){

      if(!this.isLogin){
        return
      }

      if(context.tokenMiningRateEvent !== null){
        context.tokenMiningRateEvent.close()
        context.tokenMiningRateEvent = null
      }

      this.$store.commit('contract/SET_CONTRACT_DATA', {longPmrRate: '--', shortPmrRate: '--'})
      context.tokenMiningRateEvent = createTokenMiningFeeEvenet(this.curPair.address, (tokenAddr, positionMiniRate) => {
        //update mining fee
        //{"longPmrRate":0,"shortPmrRate":0}
        this.$store.commit('contract/SET_CONTRACT_DATA', {longPmrRate: positionMiniRate.longPmrRate * 100, shortPmrRate: positionMiniRate.shortPmrRate * 100})
      })

      const self = this

      self.$store.dispatch('contract/getSpotPrice').then(() => {
        self.updateKLine(self.curPair.key, self.kChartTimeGap)
      });


      this.$store.dispatch('contract/loadHomeData', this.entrustType).then(r => {

        self.positionChangeFeeRatio = r.positionChangeFeeRatio;
        if(self.curTraderOpenUpperBound.amount > 0 && self.sliderValue > 0) {
          self.size = fromContractUnit(self.sliderValue / 100 * self.curTraderOpenUpperBound.amount, 2);
        }
      })

      this.loadPositionData()

      this.updateTraderOpenUpperBound()
    },

    loadPositionData () {
      const self = this
      self.loading = true

      this.$store.dispatch('contract/loadPositionData').then(r => {
      }).finally(() => {
        self.loading = false
      })
    },
    getPairByAddress (token) {
      const pair = this.$store.state.contract.pairs.find((pair) => pair.address === token)
      if(!pair){
        return {name: 'unknown', key: 'unknown'}
      }

      return pair
    },
    closeAllPositions () {

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
      const brokerId = this.$store.state.user.brokerId
      this.$store.dispatch('contract/closeAllPositions', {brokerId}).then(() => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
      }).catch((ex) => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
      })
    },
    changeKChartTimeGap (gap) {
      this.kChartTimeGap = gap
      this.toggleTimeGap(false)

      this.updateKLine(this.curPair.key, gap)
    },
    toggleTimeGap (bool) {
      this.showTimeGapDropDown = bool
    },
    updateKLine(token, gap) {
      const self = this
      getEchartsOptions({token,
        bar: gap.value,
        curPrice: fromContractUnit(this.curSpotPrice)}).then((options) => {
        self.drawKline(options)
      })
    },
    errorNotice (msg) {
      if(msg){
        this.showError = true
        this.errorMsg = msg
      }
    }
  },
  watch: {
    '$store.state.contract.contractData':{
      handler () {
        this.contractData = this.$store.state.contract.contractData;
      },
      immediate: true,
      deep: true
    },
    '$store.state.contract.curPairKey' : {
      handler (val) {
        this.unitConfig[1].text = this.curPair.key
        this.homeInit()
      },
      immediate: false,
      deep: true
    },
    '$store.state.contract.positionData.positions': {
      handler (val) {
        this.positions.splice(0)
        this.$store.state.contract.positionData.positions.forEach((item) => {
          this.positions.push(item)
        })
      },
      immediate: true,
      deep: true
    },
    '$store.state.contract.positionData.orderPositions': {
      handler (val) {
        this.positionOrders.splice(0)

        this.$store.state.contract.positionData.orderPositions.forEach((item) => {
          this.positionOrders.push(item)
        })
      },
      immediate: true,
      deep: true
    },
    '$route.name': function (){
      this.updateKLine(this.curPair.key, this.kChartTimeGap)
    },
    '$i18n.locale' : function () {
      this.tabs = {
          key1: this.$t('Trade.MyPosition.List.MyPosition'),
          key2:  this.$t('Trade.CurrentOrder.List.CurrentOrder'),
          key3:  this.$t('Trade.TradeHistory.List.TradeHistory')
      }

      this.entrustTypeConfig = [
        {text:  this.$t('Trade.OpenPosition.OpenPage.Market'), value: 0},
        {text: this.$t('Trade.OpenPosition.OpenPage.Limit'), value: 1}
      ]
    },
    user:{
      handler() {
        this.loadPositionData();
        this.tradeRecords.splice(0);
      },
    }
  },
  created () {

    context.loaded = true
    const self = this;
    if(context.timer !== null) {
      clearInterval(context.timer)
      context.timer = null
    }

    if(context.klineTimer !== null){
      clearInterval(context.klineTimer)
      context.klineTimer = null
    }

    context.klineTimer = setInterval(() => {
      if(self.$route.name === 'exchange') {
        self.updateKLine(self.curPair.key, self.kChartTimeGap)
      }

    }, 15000)

    context.timer = setInterval(() => {

      if(self.$route.name === 'home' || self.$route.name === 'exchange'){
        self.$store.dispatch('contract/getSpotPrice')
      }

      if(self.$route.name === 'home') {
        self.$store.dispatch('contract/loadPositionData')
      }
    }, 15000)

    this.homeInit()

    this.$eventBus.$on(EVENT_WALLET_CHANGE, () => {
      this.homeInit()
    })
  },
  updated () {
    this.$nextTick(() => {
      if(context.myChart){
        context.myChart.resize()
      }
    })
  }
}
</script>
<style lang="less">
.home-error {
  position: fixed;
  top: 8rem;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .derify-error-notice{
    background: #291138;
  }
}
</style>
<style lang="less" scoped>
.home-container{
  padding-top: 6.6rem;
  padding-left: 0;
  padding-right: 0;
}
.home-top {
  padding: 2rem 1.4rem;
  display: flex;
  justify-content: space-between;
  background-color: #140B32;
  &-left, &-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    .left-help-icon {
      width: 1.6rem;
      height: 1.6rem;
    }
  }
  &-right {
    align-items: flex-end;
    font-size: 1rem;
  }
  &-coin {
    display: flex;
    align-items: center;
    &-name {
      margin-right: 0.4rem;
    }
  }
  &-num {
    color: @green;
    font-weight: bold;
    font-size: 3rem;
    &-small {
      font-size: 2rem;
    }
  }
  &-percent {
    font-size: 1rem;
    height: 1.5rem;
    padding: 0 0.3rem;
    line-height: 1.5rem;
    border-radius: 1.5rem;
    color: #000;
      &.up {
      background: @green;
    }
    &.down {
      background: @red;
    }
  }
  &-icons {
    .home-top-icon {
      width: 1.6rem;
      height: 1.6rem;
      + .home-top-icon {
        margin-left: .6rem;
      }
    }
  }
  &-items {
    margin-top: .8rem;
    display: flex;
    align-items: center;
    .fc-green,.fc-red {
      margin-right: .4rem;
      &:last-child {
        margin-right: 0;
      }
    }
    .fc-65.margin {
      margin: 0 .4rem;
    }
  }
  .home-top-items + .home-top-items {
    margin-top: .1rem;
  }
}
.home-mid {
  background: #272354;
  border-radius: 1.6rem;
  padding: 2.5rem 1.6rem;
  margin: 0 1.6rem;
  &-one {
    display: flex;
    justify-content: space-between;
    .derify-dropmenu:first-child {
      flex: .7;
      margin-right: .8rem;
    }
    .derify-dropmenu:last-child {
      flex: .3
    }
  }
  &-two {
    margin-top: 2rem;
    &-title {
      display: flex;
      justify-content: space-between;
      .fc-yellow {
        margin-left: .4rem;
      }
    }
  }
  &-three {
    margin-top: 2.0rem;
  }
  &-input {
    width: 100%;
    height: 44px;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 22px;
    margin-top: .4rem;
    position: relative;
    .fc-30 {
      position: absolute;
      font-size: 1.5rem;
      top: 1rem;
      right: 1.6rem;
    }
    .derify-dropmenu {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  &-four {
    margin-top: 3rem;
    &-btn {
      width: 100%;
      height: 4.8rem;
      border-radius: 2.4rem;
      line-height: 4.8rem;
      text-align: center;
      font-size: 1.8rem;
      &.yellow-gra {
        color: #140B32;
      }
    }
    &-btn + &-btn {
      margin-top: 1.8rem;
    }
  }
}
.home-last {
  margin-top: 4rem;
  padding: 0 2rem 2rem;

  .home-last-btn-wrap{
    display: flex;
    justify-content: space-around;
    align-content: center;
    flex-wrap: nowrap;
    margin-top: 2rem;
    .home-last-four {
      &-btn {
        width: 45%;
        flex-direction: column;
        height: 4.8rem;
        border-radius: 2.4rem;
        line-height: 4.8rem;
        text-align: center;
        font-size: 1.8rem;
        &.yellow-gra {
          color: #140B32;
        }
      }
    }
    .home-last-batch-btn {
      width: 100%;
      height: 4.8rem;
      border-radius: 2.4rem;
      line-height: 4.8rem;
      text-align: center;
      font-size: 1.8rem;
      border: 0.1rem solid @orange;
      color: @orange;
    }
  }

}
.exchange-block {
  margin-top: 3rem;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .mr-4 {
      margin-right: .4rem;
    }
    .left, .right {
      display: flex;
      align-items: center;
      &-help-icon {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
  .exchange-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.2rem;
    font-size: 1.2rem;
    + .exchange-item {
      margin-top: .8rem;
    }
    &-left,&-right {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .fc-green,.fc-red {
        margin-right: .4rem;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    &-right {
      justify-content: flex-end;
    }
  }
}

.k-chart-wrap {
  width: 100%;
  margin-bottom: 1rem;
  position: relative;
  .k-chart-xtype-list{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    background-color: #140B32;
    margin-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 2rem;
   .k-chart-xtype{
     width: 3.6rem;
     height: 3.6rem;
     line-height: 3.6rem;
     text-align: center;
     color: rgba(255,255,255,0.45);
     font-size: 1.3rem;
     &.xtype-active{
       color: rgba(255,255,255,0.85);
       border-bottom: 0.1rem solid rgba(255,255,255,0.85);
     }
     &.last-xtype {
       .arrow-down-icon,.arrow-up-icon{
         width: 1.3rem;
         height: 1.3rem;
       }
     }
   }
  }
  .k-chart-ctn{
    background-color: #140B32;
  }
  .k-chart-dropdown {
    position: absolute;
    right: 0.5rem;
    top: 3.6rem;
    width: 6rem;
    background-color: #343166;
    z-index: 2010;
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    .k-chart-dropdown-item{
      height: 4.8rem;
      line-height: 4.8rem;
      text-align: center;
      color: rgba(255,255,255,0.65);
      &.xtype-active{
        background-color: #4E4D7A;
      }
    }
  }

}
</style>
