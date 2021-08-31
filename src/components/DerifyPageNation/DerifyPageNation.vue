<template>
  <div class="page-btn-wrap" v-if="total > 1">
    <div class="page-btn" @click="goPage(1)">
      <i class="page-left-icon">
        <img v-if="leftOn" src="@/assets/icons/page-left-on.png" alt="" style="width: 5.5rem; height: 3.3rem"/>
        <img v-else src="@/assets/icons/page-left.png" alt="" style="width: 5.5rem; height: 3.3rem"/>
      </i>
    </div>
    <ul class="page-items">
      <template v-for="(item,key) in items">
        <li :key="key" :class="item === curPage ? 'fc-yellow' : ''"  @click="goPage(item)">{{item}}</li>
      </template>
    </ul>
    <div class="page-btn" @click="goPage(total)">
      <i class="page-right-icon">
        <img v-if="rightOn" src="@/assets/icons/page-right-on.png" alt="" style="width: 5.5rem; height: 3.3rem"/>
        <img v-else src="@/assets/icons/page-right.png" alt="" style="width: 5.5rem; height: 3.3rem"/>
      </i>
    </div>
  </div>
</template>
<style lang="less" scoped>
.page-btn-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .page-items {
    display: flex;
    justify-content: space-between;
    align-items: center;
    li{
      width: 4rem;
      height: 3rem;
    }
  }
}
</style>
<script>
export default {
  props: {
    total:{
      type: Number,
      default: 1
    },
    cur:{
      type: Number,
      default: 1
    }
  },
  events:['onGoPage'],
  data() {
    return {
      curPage: this.cur
    }
  },
  computed:{
    leftOn () {
      return this.curPage > 1
    },
    rightOn () {
      return this.curPage < this.total
    },
    items () {
      const items = []
      for(let i = -2; i <= 2; i++){
        const pageNum = this.curPage + i
        if(pageNum <= this.total && pageNum > 0) {
          items.push(pageNum)
        }
      }

      return items
    }
  },
  methods:{
    goPage (pageNum) {
      const cur = this.curPage
      const total = this.total

      if(cur === pageNum) {
        return
      }

      this.curPage = pageNum

      this.$emit('onGoPage', pageNum)
    }
  }
}
</script>
