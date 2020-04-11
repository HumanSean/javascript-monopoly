/*
 * @Author: Human Sean
 * @Email: humansean@qq.com
 * @Date: 2020-04-09 14:26:45
 * @LastEditTime: 2020-04-11 17:41:24
 * @Description: 一切跟DOM有关的操作
 */
// 快捷编号
var map = document.querySelector('.map')
var dice = document.querySelector(".dice")
var choosebox = document.querySelector(".choosebox")
var choosechr = document.querySelector(".choosechr")
var title = document.querySelector(".title")
var info = document.querySelector('.info')
var dialog = document.querySelector(".dialog")
var infobox = document.querySelector(".infobox")
var msgbox = document.querySelector(".msgbox")
// 创建升级造房动画
function construct() {
    let construct = document.createElement('div')
    construct.className = 'construct'
    for (let i = 0; i < 5; i++) {
        const img = document.createElement('img')
        img.src = `img/c${i + 1}.png`
        construct.append(img)
    }
    return construct
}
// 创建升级的房子
function buidings(index) {
	let img = document.createElement('img')
	img.src = `img/l${index + 1}.png`
	img.className = 'house'
	return img
}
// 写入地图棋格
for (let i = 0; i < 30; i++) {
    let box = document.createElement('div')
    let h3 = document.createElement('h3')
    box.className = 'box'
    box.append(h3)
    map.prepend(box)
}
// 绑定选择
Array.from(document.querySelectorAll('.choosebox li')).forEach((node, index) => {
    node.addEventListener('click', () => {
        chooseNumber(index)
    })
})
// 更改选择配置时的DOM显示
function writeSetting(title, startNum, num) { 
    choosebox.firstElementChild.innerHTML = title
    Array.from(choosebox.lastElementChild.children).forEach((node, index) => {
        node.innerHTML = startNum + index
        switch (num) {
            case 3:
                finishChooseNumber()
                break
            case 2:
                if (index > 1) {
                    disableBox(node)
                }
                break
            case 1:
                if (index > 2) {
                    disableBox(node)
                }
                break
            case 0:
                if (index < 1) {
                    disableBox(node)
                }
                break
        }
    })
}
 // 禁用选框，避免人数总和大于四
function disableBox(node) {
	node.style.pointerEvents = "none"
	node.style.background = "grey"
}
// 结束人数选择，开启角色选择，并画上地图
function finishChooseNumber() {
	choosebox.style.display = "none"
    choosechr.style.display = "block"
}
// 创造复用的箭头
let arrow = document.createElement('div')
arrow.className = 'arrow'
let img = document.createElement('img')
img.src = "img/arrow.png"
arrow.append(img)
 // 选择角色
Array.from(choosechr.lastElementChild.children).forEach(item => {
	item.firstElementChild.addEventListener('mouseover', function(){ // 下标箭头
		item.appendChild(arrow)
	})
    item.firstElementChild.addEventListener('click', () => { // 绑定角色
         // 处理选中效果
        item.firstElementChild.style.border = "1px solid #666"
        let index = document.createElement('div')
        index.innerHTML = `${players.length + 1}`
        index.className = 'index'
        item.appendChild(index) 
        item.removeChild(arrow)
        item.style.pointerEvents = "none"
        // 创建角色对应棋子
        let name = item.children[1].innerHTML
        let node = document.createElement('img')
        node.className = 'chr'
        node.src = `img/${name}.png`
        places[0].node.append(node)
        // 处理角色逻辑
		binding(node, name)
	})
})
// 开始游戏
function gameStart() {
	choosechr.parentElement.style.display = "none"
	title.style.visibility = "visible"
	updatePlayer(players[s].name)
    writeInfo()
    placeInfo()
    person = players[0]
}
// # 界面显示相关

// 掷骰区
dice.addEventListener("click", () => {
    game()
})

function rollDice(num) { // 掷骰子
	let bg = generateNum(1, 2)
	dice.style.background = `url(img/s${bg}.jpg)`
	setTimeout(function(){
		dice.style.background = `url(img/${num}.jpg)`
	}, 300)
	toggleDice(false)
}

function toggleDice(state) {
    if (state) {
        dice.style.pointerEvents = "auto"
    } else {
        dice.style.pointerEvents = "none"
    }
}

// 游戏信息区

// 当前行动玩家
function updatePlayer(name) {
    title.innerHTML = name
    title.style.background = colorScheme[name]
}
// 当前回合数
function updateRound() {
    let num = +document.querySelector('.big-box span b').innerHTML + 1
    document.querySelector('.big-box span b').innerHTML = num
    // if (num % 7 === 0) { // 每周新闻 // - 也许能插入随机的机会命运
        
    // }
    // if (num % 30 === 0) { // 发工资啦
    //     let salary = 5000 * num / 30
    //     players.forEach(player => {
    //         player.money += salary
    //     })
    //     updateInfo()
    //     setTimeout(() => {
    //         showMsgbox(`又到了每月的发薪日啦！每位玩家获得$${salary}`)
    //     }, v * .5)
    // }
}
// 显示玩家信息
function writeInfo() {
	let num = playerNumber + npcNumber
	for (let i = 0; i < num; i++) {
        let node = document.createElement('div')
        let h2 = document.createElement('h2')
        let h3 = document.createElement('h3')
        h3.innerHTML = `$${players[i].money}`
        h2.innerHTML = players[i].name
        h2.style.background = colorScheme[players[i].name]
        node.append(h3)
        node.append(h2)
        info.append(node)
	}
}
// 实时显示金钱
function updateInfo() {
    let num = playerNumber + npcNumber
    for (let i = 0; i < num; i++) {
        info.children[i].firstElementChild.innerHTML = "$" + players[i].money        
    }
}
// 判断后把角色挪走
function updateBankrupt(node, index) {
    info.children[index].firstElementChild.style.display = "none"
    info.children[index].append(node)
}

// 提前隐藏区
// 显示地皮归属
function buyPlace(node, color) {
    node.style.boxShadow = `3px 3px 3px inset ${color},3px -3px 3px inset ${color},-3px 3px 3px inset ${color}, -3px -3px 3px inset ${color}`
}
// 显示造房动画
function upgradeHouse(node, state) {
    let upgrade = construct()
    node.prepend(upgrade)
    setTimeout(() => {
        node.removeChild(upgrade)
        node.append(buidings(state))
        gameSequence(s)
    }, 2000)
}
// 显示地产信息
function placeInfo() {
    places.forEach(place => {
        place.node.addEventListener('mouseover', () => {
            if (place.state >= 0) {
                infobox.style.display = "block"
                infobox.firstElementChild.innerHTML = place.name
                infobox.lastElementChild.children[0].innerHTML = `地主：${place.owner}`
                infobox.lastElementChild.children[1].innerHTML = `价格：${place.value}`
                if (place.owner) {
                    let state = 5 / (place.state * 3 + 1)
                    let cost = place.value / (state > .5 ? Math.ceil(state) : state)
                    infobox.lastElementChild.children[2].innerHTML = `住宿：${cost}`
                } else {
                    infobox.lastElementChild.children[2].innerHTML = ""
                }
            } else {
                return
            }
        })
        place.node.addEventListener('mouseout', () => {
            infobox.style.display = "none"
        })
    })
}
// 显示消息框
function showMsgbox(msg){
	msgbox.style.display = "block"	
	msgbox.innerHTML = msg
	setTimeout(() => {
		msgbox.style.display = "none"
	},v * 1.6)
}
// 显示购买框
function showDialog(type, allowButton) {
	dialog.style.display = 'block'
	let title, msg
	let {name, value, state} = places[person.position]
	if (type === "purchase") {
		title = "购买地产"
		msg = `请问你要花费$${value * (state + 1)}来购买${name}吗？`
	} else {
		title = "升级地产"
		msg = `请问你要花费$${value / 2}来升级${name}吗？`
	}
	dialog.children[1].innerHTML = title
	dialog.firstElementChild.innerHTML = msg
	if (allowButton) {
		dialog.children[2].style.pointerEvents = "auto"
		dialog.children[2].style.background = "#f2f2f2"
	} else {
		dialog.children[2].style.pointerEvents = "none"
		dialog.children[2].style.background = "#454545"
    }
    dialog.children[2].onclick = () => { // 确定按钮
        dialogClicked(type , true)
    }
}
dialog.children[3].addEventListener('click', () => { // 取消按钮
	dialogClicked("", false)
})
// 关闭购买框
function closeDialog() {
    dialog.style.display = "none"
}


// 设置区域
document.querySelectorAll('.big-box button')[0].addEventListener('click', function() { // 开启指南
    if (this.innerHTML === "规则介绍") {
        this.innerHTML = "返回"
        document.querySelector('.instruction').style.height = "100%"
    } else {
        this.innerHTML = "规则介绍"
        document.querySelector('.instruction').style.height = "0"
    }
})
document.querySelectorAll('.big-box button')[1].addEventListener('click', function() { // 设置速度
    let text = v > 600 ? '正常' : '加快'
    this.innerHTML = `${text}速度`
	v = 1300 - v
})
document.querySelectorAll('.big-box button')[2].addEventListener('click', function() { // 托管
    if (this.innerHTML === "开启托管") {
        this.innerHTML = "取消托管"
        players.forEach(player => {
            if (player.control) {
                player.control = ""
            }
        })
    } else {
        this.innerHTML = "开启托管"
        players.forEach(player => {
            if (player.control === "") {
                player.control = 1
            }
        })
    }
    
})

// 预加载图片
window.addEventListener('load', () => {
    let images = []
    let src = [
        "img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg", "img/5.jpg", "img/6.jpg", "img/s1.jpg", "img/s2.jpg",
        "img/c1.png", "img/c2.png", "img/c3.png", "img/c4.png", "img/c5.png", "img/l1.png", "img/l2.png", "img/l3.png",
        "img/arrow.png", "img/batman.png", "img/superman.png", "img/green lantern.png", "img/robin.png", "img/catwoman.png", "img/harley quinn.png", "img/joker.png",
    ]
    src.forEach((src, index) => {
        images[index] = new Image()
        images[index].src = src
    })
})
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
/*
 * @Author: Human Sean
 * @Email: humansean@qq.com
 * @Date: 2020-03-16 10:58:11
 * @LastEditTime: 2020-04-09 21:32:19
 * @Description: 大富翁的核心逻辑处理
 */
// 轮骰顺序
function gameSequence(index){
	if (index === (playerNumber + npcNumber) - 1) { // 从最后一位玩家到第一位玩家
		index = 0
		updateRound()
	} else { // 下一位玩家
		index ++		
	}
	
	setTimeout(() => {
		if (!checkPlayerState(index)) { // 检查下一位玩家状态：false的话就继续轮骰
			gameSequence(index)
		}
	}, v)
	
}

function playerMove(index) { // 角色移动一步
	if (person.position === 29) {
		person.position = -1
		places[0].node.append(players[index].node)
		updateInfo()
		players[index].money += 1000
	}
	person.position ++
	places[person.position].node.append(players[index].node)
}

function game(){ // 掷筛到动作完成
	//骰子点数显示
	let num = generateNum(1, 6)
	rollDice(num)
	//绑定对应角色
	person = players[s]
	let move = setInterval(() => { // 角色按速度间隔向下一个棋格移动
		playerMove(s)
	}, v)
	
	setTimeout(() => { // 停下后触发棋格事件
		clearInterval(move) // 停止移动
		let place = places[person.position]
		// 买地产 // - 涉及异步
		if (!place.owner) { // 该地产没有地主
			if(person.control){ // 玩家角色才出现选择框
				showDialog("purchase", person.money > place.value)
			} else { // NPC行为，买了后还有3000保底才决定买
				setTimeout(() => dialogClicked("purchase", (person.money - place.value) > 3000), v / 3)
			}
		} else if (place.owner && place.owner !== person.name && place.owner != "sean") { // 住房：存在地主且不属于本人或特殊区域
			let owner = players.find(player => player.name === place.owner) // 找到主人
			if(owner.stop){ // 主人不在家
				showMsgbox("房子主人不在，免费过夜1晚！")
			} else{ // 付地租
				let state = 5 / (place.state * 3 + 1) // 5 / (1 4 7 10)
				let cost = place.value / (state > .5 ? Math.ceil(state) : state) // 根据地产等级计算房租
				person.money -= cost
				owner.money += cost
				showMsgbox(`${owner.name}感谢${person.name}在${place.name}消费$${cost}`)
				checkBankrupt()
			}
			gameSequence(s)
		} else if (place.owner === person.name) { // 升级房子 // - 涉及异步
			if (place.state === 3) {
				gameSequence(s)
			} else {
				if(person.control){ // 玩家控制
					showDialog("upgrade", person.money > place.value * .5)
				} else { // NPC行为
					dialogClicked("upgrade", (person.money - place.value / 2) > 2000) // 大于3000块保底才升级
				}
			}
		} else if (place.state === "goodEvent") { // 捡到钱
			let randomMoney = 500 * generateNum(0, 7)
			person.money += randomMoney
			showMsgbox(`恭喜你捡到了$${randomMoney}`)
			gameSequence(s)
		} else if (place.state === "badEvent") { // 交税
			let randomMoney = 300 * generateNum(0, 7)
			person.money -= randomMoney
			showMsgbox(`你需要向税务局缴纳税收$${randomMoney}`)
			checkBankrupt()
			gameSequence(s)
		} else if (place.state === "jail") {
			person.stop = generateNum(1, 3)
			showMsgbox(`偷税漏税被抓，关押${person.stop}天`)
			gameSequence(s)
		} else if (place.state === "casino") {
			let num = generateNum(1, 6)
			rollDice(num)
			setTimeout(() => {
				let casinoMoney = num * 500
				person.money += casinoMoney
				showMsgbox(`恭喜你获得了$${casinoMoney}`)
				updateInfo()
				gameSequence(s)
			}, v * 2)
			// toggleDice(true)
		} else if (place.state === "surprise") { // 机会命运 // - 涉及异步
			var event = generateNum(0, 31)
			person.money += fates[event].value
			// 坐牢事件
			if (fates[event].stop){
				setTimeout(function(){
					person.position = 11
					person.stop = fates[event].stop
					places[11].node.append(person.node)
					checkBankrupt()
					gameSequence(s)
				},v * 1.5)
			} else {
				checkBankrupt()
				gameSequence(s)
			}
			showMsgbox(fates[event].text)
		} else if (place.state === "airport") { // 飞机 // - 涉及异步
			let des = place.name === "白云机场" ? "英国" : "中国"
			showMsgbox(`你花费$800搭乘飞机前往${des}`)
			setTimeout(() => {
				person.position = 30 - person.position
				places[person.position].node.append(person.node)
				checkBankrupt()
				gameSequence(s)
			},v * 1.5)
			person.money -= 800
		} else if (place.state === "trip") { // 旅游度假
			person.stop = generateNum(1, 3)
			person.money -= person.stop * 1000
			showMsgbox(`${person.name}花费${person.stop * 1000}享受旅游度假${person.stop}天`)
			checkBankrupt()
			gameSequence(s)
		}
		updateInfo()
	},v * (num + 0.9))
}

function dialogClicked(type, action) { // 购买或取消
	let place = places[person.position]
	if (!action) { // 关闭对话框: 通过action模拟NPC购买与否
		closeDialog()
		gameSequence(s)
		return
	}
	if (type === "purchase") { // 购买
		place.owner = person.name // 房产证署名
		person.money -= place.value // 交钱
		let color = colorScheme[person.name]
		buyPlace(place.node, color) // 显示地皮归属
		showMsgbox(`恭喜你获得了${place.name}`)
		gameSequence(s)
	} else { // 升级
		let upgradeMap = ["一座小房子", "一套大别墅", "一栋大酒店"]
		person.money -= place.value / 2
		place.state ++
		showMsgbox(`恭喜你在${place.name}建了${upgradeMap[place.state - 1]}`)
		// 造房动画效果
		upgradeHouse(place.node, place.state - 1)
	}
	closeDialog()
	updateInfo()
}

function generateNum(min, max) { // 生成随机数
	return Math.floor(Math.random() * (max - min)) + min
}

// 判断相关
// 判断轮到的下个玩家是否处在停止状态
function checkPlayerState(index) {
    let player = players[index]
	if (player.stop) { // 停止状态
		if (player.position === 11) {
			showMsgbox(`${player.name}还有${player.stop}天可以出狱`)
		} else {
			showMsgbox(`${player.name}离难得的假期结束还有${player.stop}天`)
        }
        player.stop --
		return false
	} else if (player.state === "bankrupt") {
		return false
	} else {
		if (!player.control) { // NPC行动的地方
			setTimeout(() => {
				game()
			},v*2)
		} else { // 解锁骰子，玩家行动
			toggleDice(true)
        }
        // 轮到下一玩家
		s = index
		updatePlayer(player.name)
		return true
	}
}
// 判断胜利条件
function checkFinish(){
    let count = 0
    let winner
    players.forEach(player => { // 数还有多少人处于活跃状态
        if (player.state === "active") {
            count ++
            winner = player
        }
    })
    if (count === 1) { // 只有一个人活跃的话
        setTimeout(() => {
            alert(`${winner.name}赢啦！恭喜你成为最有钱的人！`)
            location.reload()
        }, v * 2)
    }
}
// 判断破产
function checkBankrupt() {
    if (person.money < 0) { // 当前玩家的钱变成负值了
        setTimeout(() => {
            person.stop = 0
            person.state = "bankrupt"
            alert(`很遗憾，${person.name}破产了，所有地产将充公处理。`)
            updateBankrupt(person.node, players.indexOf(person))
            places.forEach(place => { // 地产充公
                if (place.owner === person.name) {
                    place.owner = ""
                }
            })
            checkFinish() // 每当有人破产就判断是否结束
        }, v / 2)
    }
}