<template>
  <el-pagination
    background
    layout="prev, pager, next"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :total="1000"
    class="pag">
  </el-pagination>
</template>

<script>
  export default {
    name: 'pagination',
    methods:{

      //每页显示的条数
      handleSizeChange(val){
        this.pagesize = val
        this.getData(val,1)
        this.currentPage = 1
      },
      //显示第几页
      handleCurrentChange(val){
        this.currentPage = val
        this.getData(this.pagesize,val)
      },

    }
  };

</script>

<style>
 .pag{
   margin-left: 380px;
   margin-top: 30px;
 }

</style>
