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
					place.node.style.boxShadow = "1px 1px 1px inset #454545, 1px -1px 1px inset #454545, -1px 1px 1px inset #454545, -1px -1px 1px inset #454545"
                }
            })
            checkFinish() // 每当有人破产就判断是否结束
        }, v / 2)
    }
}