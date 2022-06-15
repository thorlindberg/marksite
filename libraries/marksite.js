// render page
var rawFile = new XMLHttpRequest()
rawFile.open("GET", "contents.json", false)
rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {

            // parse json
            var allText = rawFile.responseText
            const contents = JSON.parse(allText)

            // set title
            document.title = contents.title
            document.getElementById("title").innerHTML = contents.title

            // get page name
            var pageName = document.URL.split('/').pop().split('.')[0]
            const isEmpty = pageName == ""
            pageName = isEmpty ? "index" : pageName
            const isIndex = pageName == "index"

            // render markdown
            var parsed = ""
            var rawF = new XMLHttpRequest()
            rawF.open("GET", `markdown/${pageName}.md`, false)
            rawF.onreadystatechange = function () {
                if (rawF.readyState === 4) {
                    if (rawF.status === 200 || rawF.status == 0) {
                        var allText = rawF.responseText
                        parsed = marked.parse(allText)
                        document.getElementById("markdown").innerHTML = parsed
                    }
                }
            }
            rawF.send(null)

            // render navigation
            document.getElementById("navigation").innerHTML = `<div ${isIndex ? "id='active'" : ""} class="group"><a target="_self" ${isIndex ? "" : "href='index.html'"} class="${isIndex ? "active" : ""} item d-flex justify-content-between gap-3 ms-3 pe-3 py-2"><div>${contents.title}</div><div class="glyph">›</div></a></div>`
            for (const page in contents.pages) {
                const activePage = pageName == contents.pages[page]
                if (activePage) {
                    document.getElementById("title").innerHTML = page
                }
                document.getElementById("navigation").innerHTML = document.getElementById("navigation").innerHTML + `<div ${activePage ? "id='active'" : ""} class="group"><a target="_self" ${activePage ? "" : `href="${contents.pages[page]}.html"`} class="${activePage ? "active" : ""} item d-flex justify-content-between gap-3 ms-3 pe-3 py-2 align-items-center"><div>${page}</div><div class="glyph">›</div></a></div>`
            }
            document.getElementById("navigation").innerHTML =  document.getElementById("navigation").innerHTML + `<div id="push" class="group" onclick="document.body.scrollTop = document.documentElement.scrollTop = 0"><a target="_self" class="item d-flex justify-content-between gap-3 ms-3 pe-3 py-2 align-items-center"><div>Scroll to top</div><div class="glyph">⇧</div></a></div>`

            // render references
            parsed.split("\n").forEach(n => {
                if (["<h2", "<h3", "<h4", "<h5", "<h6"].filter(s => n.startsWith(s)).length) {
                    const text = n.substring(n.indexOf('">') + '">'.length, n.indexOf('</'))
                    const anchor = text.toLowerCase().replaceAll(/\?.*$/g,"").replaceAll(" ", "-")
                    document.getElementById("active").innerHTML = document.getElementById("active").innerHTML + `<a target="_self" onclick="document.getElementById('${anchor}').scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })" class="item d-flex justify-content-between gap-3 ms-3 pe-3 py-2"><div>${text}</div><div class="glyph">#</div></a>`
                }
            })

            // render links
            var linksHTML = ""
            for (const link in contents.links) {
                linksHTML += `<a href="${contents.links[link]}">${link}</a>`
            }
            document.getElementById("links").innerHTML = linksHTML;

            // set author
            document.getElementById("author").innerHTML = contents.author

            // render legal
            document.getElementById("legal").innerHTML = "";
            var legalHTML = ""
            for (const legal in contents.legal) {
                legalHTML += `<a href="${contents.legal[legal]}">${legal}</a>`
            }
            document.getElementById("legal").innerHTML = legalHTML;

        }
    }
}
rawFile.send(null)

// variables
var isToggled = true
var isScrolled = false

// method for toggling sidebar
const toggleSidebar = () => {
    switch (isToggled) {
        case true:
            document.getElementById("navigation").classList.add("d-lg-none")
            document.getElementById("markdown").classList.add("col-7")
            document.getElementById("markdown").classList.remove("col-9")
            document.getElementById("sidebar").classList.add("pe-0")
            document.getElementById("sidebar").classList.remove("col-lg-3")
            document.getElementById("sidebar").classList.remove("sidebar")
            document.getElementById("sidebar").classList.add("header")
            break
        case false:
            document.getElementById("navigation").classList.remove("d-lg-none")
            document.getElementById("markdown").classList.remove("col-7")
            document.getElementById("markdown").classList.add("col-9")
            document.getElementById("sidebar").classList.remove("pe-0")
            document.getElementById("sidebar").classList.add("col-lg-3")
            if (!isScrolled) {
                document.getElementById("sidebar").classList.add("sidebar")
                document.getElementById("sidebar").classList.remove("header")
            }
            break
    }
    isToggled = !document.getElementById("navigation").classList.contains("d-lg-none")
}

// listener for navigation scroll styling
document.addEventListener("scroll", e => {

    isScrolled = window.scrollY > 0
    switch (isScrolled) {
        case true:
            document.getElementById("sidebar").classList.remove("sidebar")
            document.getElementById("sidebar").classList.add("header")
            break
        case false:
            if (isToggled) {
                document.getElementById("sidebar").classList.add("sidebar")
                document.getElementById("sidebar").classList.remove("header")
            }
            break
    }

})

// stick navigation position

const offset = document.getElementById("navigation").offsetTop
const bottom = document.getElementById("navigation").getBoundingClientRect().height

const height = window.innerHeight
document.getElementById("navigation").style.minHeight = `${height - offset}px`

const isLarger = (offset + bottom) > height
switch (isLarger) {
    case true:
        document.getElementById("navigation").style.top = `${0 - bottom + height}px`
        break
    case false:
        document.getElementById("navigation").style.top = `${offset}px`
        break
}

window.addEventListener('resize', e => {

    const height = window.innerHeight
    document.getElementById("navigation").style.minHeight = `${height - offset}px`

    const isLarger = (offset + bottom) > height
    switch (isLarger) {
        case true:
            document.getElementById("navigation").style.top = `${0 - bottom + height}px`
            break
        case false:
            document.getElementById("navigation").style.top = `${offset}px`
            break
    }

})