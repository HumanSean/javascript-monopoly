/*
 * @Author: Human Sean
 * @Email: humansean@qq.com
 * @Date: 2020-03-16 10:58:11
 * @LastEditTime: 2020-04-09 20:44:06
 * @Description: 所有的数据存放，包括角色棋子、棋格以及机会命运
 */
// 定义角色
var players = []
function CreatePlayer(name, index, money, state, stop, control, node) { // 创建角色
	this.name = name // 名字
	this.index = index // 顺序
	this.money = money // 金钱
	this.state = state // 状态：活跃或破产
	this.stop = stop // 停止天数
	this.control = control // 是否玩家控制
	this.node = node // 对应DOM棋子
	this.position = 0 // 当前位置
	players.push(this)
}
 // 棋格数据
var places = []
function CreateBox(name, value, state, owner, index) { // 创建棋格
	this.name = name // 地名
	this.value = value // 价值
	this.state = state // 状态：特殊事件 / 普通地产的等级
	this.owner = owner // 有无地主 / 特殊棋格
	this.node = document.querySelectorAll('.map>div')[index] // 对应DOM 注：此处的index是乱序的，为了达到棋格顺时针排列的效果
	this.node.firstElementChild.append(name) // 顺手写入地名
	places.push(this)
}
new CreateBox("起点", 2000, "goodEvent", "sean", 18)
new CreateBox("中国", 5000, 0, "", 19)
new CreateBox("越南", 1000, 0, "", 20)
new CreateBox("韩国", 1300, 0, "", 21)
new CreateBox("机会", 1000, "surprise", "sean", 22)
new CreateBox("日本", 3000, 0, "", 23)
new CreateBox("俄罗斯", 4000, 0, "", 24)
new CreateBox("白云机场", 1000, "airport", "sean", 25)
new CreateBox("交所得税", 1000, "badEvent", "sean", 26)
new CreateBox("命运", 1000, "surprise", "sean", 27)
new CreateBox("埃及", 1600, 0, "", 28)
new CreateBox("监狱", 0, "jail", "sean", 29)
new CreateBox("澳大利亚", 2400, 0, "", 17)
new CreateBox("新西兰", 1800, 0, "", 15)
new CreateBox("南极洲", 20000, 0, "", 13)
new CreateBox("赌场", 1000, "casino", "sean", 11)
new CreateBox("机会", 1000, "surprise", "sean", 10)
new CreateBox("捡到钱", 1000, "goodEvent", "sean", 9)
new CreateBox("巴西", 2000, 0, "", 8)
new CreateBox("阿根廷", 2200, 0, "", 7)
new CreateBox("墨西哥", 2400, 0, "", 6)
new CreateBox("美国", 4500, 0, "", 5)
new CreateBox("意大利", 3000, 0, "", 4)
new CreateBox("伦敦机场", 1000, "airport", "sean", 3)
new CreateBox("英国", 3600, 0, "", 2)
new CreateBox("命运", 1000, "surprise", "sean", 1)
new CreateBox("阿尔卑斯山", 1000, "trip", "sean", 0)
new CreateBox("德国", 3400, 0, "", 12)
new CreateBox("法国", 3200, 0, "", 14)
new CreateBox("西班牙", 2800, 0, "", 16)
// 机会命运
var fates = []
function CreateFate(text, value, stop) { // 创建机会命运
	this.text = text // 对应说明
	this.value = value // 金钱变动值
	this.stop = stop // 是否需要坐牢
	fates.push(this)
}
new CreateFate("扶老奶奶过马路的事迹被大家知道了，村委会颁发$1000奖金", 1000, 0)
new CreateFate("中了彩票，获得头奖$5000", 5000, 0)
new CreateFate("在街边被劫匪抢劫，为了保住性命，失去$3000", -3000, 0)
new CreateFate("喝了一杯一点点，花费$30", -30, 0)
new CreateFate("路边捡到$500", 500, 0)
new CreateFate("吃鱼卡到鱼刺，去医院花了$800", -800, 0)
new CreateFate("钱包落在出租车里，丢失$1000", -1000, 0)
new CreateFate("空闲时间去兼职家教，收获$2000", 2000, 0)
new CreateFate("扶老奶奶过马路摔了一跤，买药花了$100", -100, 0)
new CreateFate("手机突然坏了，换了部最新款iPhone，花费$1300", -1300, 0)
new CreateFate("吃羊肉火锅，花费$500", -500, 0)
new CreateFate("去日本看樱花，花费$2000", -2000, 0)
new CreateFate("什么也没有发生，除了钱包少了$800", -800, 0)
new CreateFate("什么也没有发生, 除了钱包多了$1000", 1000, 0)
new CreateFate("在广交会做翻译，获得$1000", 1000, 0)
new CreateFate("在校门口发传单，得到$100", 100, 0)
new CreateFate("获得三好学生奖学金，奖金$3000", 3000, 0)
new CreateFate("抢了个微信红包，获得$1", 1, 0)
new CreateFate("梦见得到$3000奖金，醒来决定花$50去拜神", -50, 0)
new CreateFate("获得了$3000奖金！赶紧花$500去还愿", 2500, 0)
new CreateFate("卖闲置赚了$100", 100, 0)
new CreateFate("什么也没有发生", 0, 0)
new CreateFate("看电影花费了$100", -100, 0)
new CreateFate("还花呗欠款$999", -999, 0)
new CreateFate("一年一度的双十一到了，剁手花了$2000", -2000, 0)
new CreateFate("突然很渴想买瓶矿泉水，花费$5", -5, 0)
new CreateFate("去工地搬砖赚了$500", 500, 0)
new CreateFate("偷税漏税罚款$1000，拘留1日", -1000, 1)
new CreateFate("超速行驶被罚款$2000，拘留2天", -2000, 2)
new CreateFate("被查水表发现有违建，罚款$1000并拘留3日", -1000, 3)
new CreateFate("考试作弊被拘留5日", 0, 5)