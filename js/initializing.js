/*
 * @Author: Human Sean
 * @Email: humansean@qq.com
 * @Date: 2020-03-16 10:58:11
 * @LastEditTime: 2020-04-09 21:28:45
 * @Description: 完成游戏开局前的初始化
 */
var s = 0 // 初始化玩家顺序 / sequence
var playerNumber = 0 // 玩家数量
var npcNumber = 0 // npc数量
var startMoney = 0 // 初始化金钱
var v = 800 // 初始速度
var person // 初始化当前玩家
var colorScheme = { // 不同角色对应颜色方案
	"Joker": "#5E45AB",
	"Batman": "#121212",
	"Superman": "#274D7A",
	"Catwoman": "#B04E58",
	"Harley Quinn": "pink",
	"Robin": "#FA2A14",
	"Green Lantern": "#5FAE2E"
}

function chooseNumber(num) { // 选择配置
	if (!startMoney) { // 选择起始金钱
		writeSetting("玩家人数", 1)
		startMoney = num * 5000 + 10000
	} else if (!playerNumber) { // 选择玩家数量
		writeSetting("电脑人数", 0, num)
		playerNumber = +num + 1
	} else { // 选择npc数量
		npcNumber = +num
		finishChooseNumber()
	}
}
function binding(node, name){ // 角色选择
	let control = players.length < playerNumber ? 1 : 0 // 玩家还是电脑控制
	new CreatePlayer(name, players.length, startMoney, "active", 0, control, node) // 创建一个人物
	if (players.length == (playerNumber + npcNumber)) { // 游戏开局
		gameStart()
	}
}
