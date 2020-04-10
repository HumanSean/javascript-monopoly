/*
 * @Author: Human Sean
 * @Email: humansean@qq.com
 * @Date: 2020-04-09 14:26:45
 * @LastEditTime: 2020-04-10 09:17:17
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
// 更改选择配置时的DOM显示
function writeSetting(title, startNum, num) { 
    choosebox.firstElementChild.innerHTML = title
    Array.from(choosebox.lastElementChild.children).forEach((node, index) => {
        node.innerHTML = startNum + index
        console.log(num);
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
		item.appendChild(arrow);
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
    //     }, v * .5);
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
	},v * 1.6);
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
		dialog.children[2].style.background = "#e1e1e1"
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