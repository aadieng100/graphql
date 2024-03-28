const domain = `https://learn.zone01dakar.sn`

const homeEndPoint = `${domain}/api/graphql-engine/v1/graphql`

const signinEndPoint = `${domain}/api/auth/signin`

const badCredentialmsg = `Bad Credentials ❌`

//The request for user data
const request = `
{
    user {
        id
        login
        email
        campus
        lastName
        firstName
        auditRatio
        totalUp
        totalDown
        skill:transactions (
        order_by: [{ type: desc }, { amount: desc }]
        distinct_on: [type]
        where: { 
          type: { _like: "skill_%" }
        },
      ) 
      { 
        type
        amount
      }
      audited:audits(
        where:{
          grade:{_is_null:false},
        }
        ){
        grade
      }
    }
    allxp: transaction (
    order_by: [{ createdAt: desc }, { amount: desc }]
    where: { 
      event: { object: { type: { _eq:"module" } } } 
      type: { _eq: "xp" }
    }) 
    { 
      type
      amount
      path
      createdAt
      object{
        name
      }
    }
    level: transaction(
      order_by:{amount:desc}
        limit:1
        where: {
          type: { _eq: "level" },
          _or:{event:{object:{name:{_eq:"Div 01"}}}}
        }
        ) {
        amount 
    }
}
`

//Verify if user is logged or not
async function isAuth() {
    const requestCotent = {
        query: request
    }

    const fetchParams = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestCotent),
    }

    const response = await fetchData(homeEndPoint, fetchParams)
    if (!response.success) {
        handleError(response.error)
    }
    return response.data
}

//fetching data func
const fetchData = async (link, fetchParams) => {
    try {
        const response = await fetch(link, fetchParams)
        if (!response.ok) {
            return { success: false }
        }
        return { success: true, data: await response.json() }
    } catch (error) {
        console.log("error when fetching data :", error);
        return { success: false, error: error }
    }
}

//Validate url
function goodURL() {
    const currentURL = window.location.pathname;

    return (currentURL === "/index.html")
}

//adding html head
const addHead = (head) => {
    const newHead = document.createElement('head');
    const oldHead = document.querySelector('head');
    newHead.innerHTML = head;
    document.documentElement.replaceChild(newHead, oldHead);
}

//adding html body
const addBody = (page) => {
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML('afterbegin', page);
}

function loadScript(scriptUrl) {

    const scripts = document.querySelectorAll('script');

    // Parcourir tous les scripts
    if (scripts.length !== 0) {
        scripts.forEach(script => {
            // Vérifier si le script a un src contenant "/static/JS/sign.js"
            if (script.src.includes('/static/js/sign.js') || script.src.includes('/static/js/index.js') || script.src.includes('/static/js/error.js')) {
                script.remove();
            }
        });
    }

    const script1 = document.createElement('script');
    const script = document.createElement('script');
    script1.src = '/static/js/tools.js';
    script.src = scriptUrl;
    script1.type = 'module'
    script.type = "module"
    document.body.appendChild(script1);
    document.body.appendChild(script);
}



async function handleError(error) {
    console.log('Error:', error);

    let data;

    if (error.response) {
        switch (error.response.status) {
            case 400:
                data = { status: "400", message: "Bad Request" }
                break;
            case 401:
                data = { status: "401", message: "Session expired" }
                break;
            case 403:
                data = { status: "403", message: "Unautorized" }
                break;
            case 404:
                data = { status: "404", message: "Page Not Found" }
                break;
            case 405:
                data = { status: "405", message: "Method Not Allowed" }
                break;
            default:
                // Gérer les autres codes d'état HTTP
                data = { status: "500", message: "Something went wrong. Please try again later." }
        }
    } else {
        // Autre erreur non-HTTP (erreur JavaScript, etc.)
        data = { status: "500", message: "Something went wrong. Please try again later." }
    }


    var errorHead = `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Page</title>
        <link rel="stylesheet" href="/static/css/error.css">
    </head>
    `

    var errorBody = `
    <body>
        <div class="container">
            <div class="status">${data.status}</div>
            <div class="message">${data.message}</div>
            <div class="button">GO HOME</div>
        </div>
    </body>
    `

    // Redirection
    addHead(errorHead)
    addBody(errorBody)
    loadScript('/static/js/error.js')
}

export function changeUrl(newUrl) {
    window.history.pushState({}, '', newUrl);
    // Mettez à jour le contenu de la page en fonction du newUrl
}

function handleRedirection() {
    changeUrl('/index.html');

    var OnloadHead = `
    <head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
	    <link rel="stylesheet" href="/static/CSS/styles.css">
	    <title>Real Time Forum</title>
    </head>
    `
    document.body.innerHTML = ''
    addHead(OnloadHead)
    loadScript('/static/js/index.js')
}

const signHead = `
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="static/css/sign.css">
    <title>GraphQl</title>
</head>
`

const signBody = `
<body>
    <div id="Message"></div>
    <div class="login-box">
        <h2>Please Login</h2>
        <form action="">
            <div class="user-box">
                <input type="text" required title="username or email" id="credential" >
                <label for="">Username or Email</label>
            </div>
            <div class="user-box">
                <input type="password" required title="password" id="pwd" >
                <label for="">Password</label>
            </div>
            <div class="showpass">
                <input type="checkbox" name="show" id="showpwd">
                <label for="showpwd">Show Password</label>
            </div>
            <a href="" id="sub">
                <span></span>
                <span></span>
                <span></span>
                <span></span>Submit
            </a>
        </form>
    </div>
</body>
`



const printLoad = () => {
    let div = document.createElement('div');
    let loader = document.createElement('div')
    div.classList = 'fullScreen';
    loader.classList = 'load'
    div.appendChild(loader)
    document.body.appendChild(div);
    setTimeout(() => {
        if (document.body.contains(div)) document.body.removeChild(div);
    }, 1000);
}

const messageToPrint = (message) => {
    setTimeout(function () {
        let toPrint = document.getElementById('Message');
        toPrint.innerText = message
        toPrint.style.visibility = 'visible';
        setTimeout(() => {
            toPrint.style.visibility = 'hidden';
        }, 1000)
    }, 500);
}



function injectData(data) {

    const homeHead = `
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Graphql</title>
        <link rel="stylesheet" href="static/css/home.css">
    </head>
    `
    addHead(homeHead)
    document.body.innerHTML = '';
    let allxp = data.allxp

    const xps = allxp.reduce((acc, objet) => acc + objet.amount, 0);
    const totalXp = auditForm(xps)

    allxp.sort((a, b) => b.amount - a.amount);

    const top10Objets = allxp.slice(0, 10);

    const tenObjets = top10Objets.map(objet => ({
        name: objet.object.name,
        // amount: (objet.amount / 1000).toFixed(1)
        amount: auditForm(objet.amount)
    }));

    let tabLevel = data.level[0]
    let userLvl = tabLevel.amount
    let userInfos = data.user[0]
    let fullName = `${userInfos.firstName} ${userInfos.lastName}`
    let userNickname = `${userInfos.login}`
    let userCampus = `${userInfos.campus}`
    let userAuditRatio = userInfos.auditRatio
    let roundedRatio = parseFloat(userAuditRatio.toFixed(1));
    let userUp = userInfos.totalUp
    let upGoodForm = auditForm(userUp)
    let userDown = userInfos.totalDown
    let downGoodForm = auditForm(userDown)
    let tabAudits = userInfos.audited
    let totalAudits = tabAudits.length

    let totalFail = 0;

    for (let i = 0; i < tabAudits.length; i++) {
        if (tabAudits[i].grade < 1) {
            totalFail++;
        }
    }


    const homePage = `
    <body>
        <header>
            <div class="logosec">
                <div class="logo">Graphql</div>
                <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
                    class="icn menuicn" id="menuicn" alt="menu-icon">
            </div>
            <div class="message">
                <h3 class="username">${fullName}</h3>
                <div class="dp">
                    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
                        class="dpicn" alt="dp">
                </div>
            </div>
    
        </header>
    
        <div class="main-container">
            <div class="navcontainer">
                <nav class="nav">
                    <div class="nav-upper-options">
                        <div class="nav-option option1">
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                                class="nav-img" alt="dashboard">
                            <h3> Infos</h3>
                        </div>
                        <div class="nav-option option5">
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183323/10.png"
                                class="nav-img" alt="blog">
                            <h3> Nickname <span>${userNickname}</span></h3>
                        </div>
    
                        <div class="nav-option option4">
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/6.png"
                                class="nav-img" alt="institution">
                            <h3> Campus <br> <span>${userCampus.charAt(0).toUpperCase() + userCampus.slice(1)}</span></h3>
                        </div>
                        <div class="nav-option logout" id="logout">
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                                class="nav-img" alt="logout">
                            <h3>Logout</h3>
                        </div>
    
                    </div>
                </nav>
            </div>
            <div class="main">
    
                <div class="box-container">
    
                    <div class="box box1">
                        <div class="text">
                            <h2 class="topic-heading">${totalXp}</h2>
                            <h2 class="topic">Total Xp Earned</h2>
                        </div>
    
                        <img src="/static/images/code.png" alt="Views">
                    </div>
    
                    <div class="box box2">
                        <div class="text">
                            <h2 class="topic-heading">${userLvl}</h2>
                            <h2 class="topic">Current Level</h2>
                        </div>
    
                        <img src="/static/images/level.png" alt="likes">
                    </div>
    
                    <div class="box box3">
                        <div class="text">
                            <h2 class="topic-heading">${roundedRatio}</h2>
                            <h2 class="topic">Audit ratio</h2>
                            <h2 class="topic"></h2>
                        </div>
                        <div class="ratio">
                            <h5>${upGoodForm}</h5>
                            <img src="/static/images/ratio.png" alt="comments">
                            <h5>${downGoodForm}</h5>
                        </div>
                    </div>
                </div>
                <div class="svgs">
    
                    <div class="svg1">
                        <div class="svgtext">
                            <h3 class="diagtitle">LAST TEN HIGH-XP PROJECTS</h3>
                            <h6>Order by XP</h6>
                        </div>
                        ${toBarGraphSvg(tenObjets)}
                    </div>
    
                    <div class="svg2">
                        <div class="svgtext">
                            <h3 class="diagtitle">AUDITS DIAGRAM</h3>
                            <h6>Total: ${totalAudits}</h6>
                        </div>
                        <h6><span style="color: white;">•</span>Passed</h6>
                        <h6><span style="color: black;">•</span>Failed</h6>
                        ${toPieSvg(totalFail)}
                    </div>
    
                </div>
            </div>
        </div>
    
    </body>
    `
    addBody(homePage)
    loadScript('static/js/home.js')
}


function toPieSvg(data) {
    let dimension = (data * 31.42 / 100)
    let pie = `
    <svg height="20" width="20" viewBox="0 0 20 20">
        <g class="circle">
            <circle r="10" cx="10" cy="10" fill="white" />
            <circle r="5" cx="10" cy="10" fill="white" stroke="black" stroke-width="10"
                stroke-dasharray="${dimension} 31.42" />

            <text class="tooltip white" x="10" y="5">PASSED</text>

            <text class="tooltip black" x="10" y="15">FAILED</text>
        </g>
    </svg>
    `
    return pie
}

function toBarGraphSvg(data) {
    const svgWidth = 550;
    const svgHeight = 420;
    const startX = 80;
    const startY = 80;
    const endX = 530;
    const endY = 420;

    let svgContent = `<svg width="${svgWidth}" height="${svgHeight}">`;
    svgContent += `<line x1="${startX}" y1="${startY}" x2="${startX}" y2="${endY}" style="stroke: black; stroke-width:5px;" />`;
    svgContent += `<line x1="${startX}" y1="${endY}" x2="${endX}" y2="${endY}" style="stroke: black; stroke-width:5px;" />`;

    let currentX = startX + 4; // Starting X position for the first rectangle

    data.reverse().forEach((item, index) => {
        const name = item.name;
        const amount = item.amount;

        // Calculating height based on KB
        const kb = parseFloat(amount); // Convert string "5 KB" to number 5
        const height = Math.floor(kb / 2); // Height is KB divided by 2 and rounded down

        // Calculating Y position
        const yPos = endY - 4 - (height); // Y position is 420 - 4 - (height / 2)

        svgContent += `<rect x="${currentX}" y="${yPos}" height="${height}" width="40" stroke-width="0" stroke="none" fill="white" />`;
        svgContent += `<text x="${currentX + 20}" y="${startY - 26}" style="writing-mode: tb;">${name}: ${amount}</text>`;

        currentX += 45; // Increment X position for the next rectangle
    });

    svgContent += `</svg>`;
    return svgContent;
}

async function init() {
    if (!goodURL()) {
        await handleError({ response: { status: 404 } });
        return
    }
    const tokenExists = localStorage.getItem('token')
    if (!tokenExists) {
        addHead(signHead)
        addBody(signBody)
        loadScript('/static/js/sign.js')
    } else {
        const data = await isAuth()
        injectData(data.data)
    }
}

function auditForm(xpaudit) {
    if (xpaudit / 1000000 < 1) {
        return (xpaudit / 1000).toFixed(2) + " KB"
    }
    return (xpaudit / 1000000).toFixed(2) + " MB"
}

async function handleSignIn(e) {
    e.preventDefault()
    const credential = document.getElementById('credential').value
    const pwd = document.getElementById('pwd').value
    let fetchParams = {
        method: "POST",
        headers: {
            "Authorization": `Basic ${customBtoa(`${credential}:${pwd}`)}`
        }
    }
    const response = await fetchData(signinEndPoint, fetchParams)
    if (!response?.success) {
        messageToPrint(badCredentialmsg)
    } else {
        localStorage.setItem("token", response.data)
        const data = await isAuth()
        console.log(data);
        injectData(data.data)
    }
}

export function customBtoa(input) {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(input);
    let binaryString = "";
    uint8Array.forEach(byte => {
        binaryString += String.fromCharCode(byte);
    })
    return btoa(binaryString);
}

function handleLogout(e) {
    e.preventDefault()
    localStorage.removeItem("token");
    addHead(signHead)
    addBody(signBody)
    loadScript('/static/js/sign.js')
    location.reload();
}

export {
    domain, homeEndPoint, signinEndPoint, badCredentialmsg, request,
    isAuth, fetchData, goodURL, addHead, addBody, loadScript, handleError,
    handleRedirection, signHead, signBody, printLoad, messageToPrint, injectData,
    toPieSvg, toBarGraphSvg, init, auditForm, handleSignIn, handleLogout
}

