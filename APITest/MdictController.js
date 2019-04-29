/**
 * 多级字典表控制器
 */
module.exports= {
    /**
     * @api {post} /foreign/v1/MdictController/getChildrenValues 获取字典表
     * @apiDescription 根据分类和父级代码查询父级下的字典表
     * @apiName getChildrenValues
     * @apiHeader {String} api_token 接口访问令牌信息
     * @apiHeader {String} key 接口访问钥匙
     * @apiGroup Mdict
     * @apiParam {string} label 字典表分类
     * @apiParam {string} value 字典表分类值
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     * {
     *   "result": [
     *      "0101",
     *    "0102"    
     *   ],
     *   "msg": "成功",
     *   "errorno": 0,
     *   "success": true
     *  }
     * @apiSampleRequest /foreign/v1/MdictController/getChildrenValues
     * @apiVersion 1.0.0
     */
    getChildrenValues(){

    }
}
