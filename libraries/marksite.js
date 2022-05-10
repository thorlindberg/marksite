marksite()

function marksite(page) {

    // settings

    window.scrollTo({ top: 0, left: 0 })
    document.body.style.overflowY = "scroll"

    // contents.json

    var rawFile = new XMLHttpRequest()
    rawFile.open("GET", "contents.json", false)
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {

                // contents

                var allText = rawFile.responseText
                const contents = JSON.parse(allText)

                // update theme
                
                document.querySelector('meta[name="theme-color"]').setAttribute('content', contents.theme)
                document.querySelector('link[rel=icon]').href = contents.icon

                // anchor

                if (page == undefined && !window.location.href.includes("#")) {
                    const first = Object.entries(contents.pages)[0][1]
                    window.location.href = "#" + first
                    page = first
                } else if (page != undefined && window.location.href.includes("#")) {
                    window.location.href = "#" + page
                } else {
                    page = window.location.href.substring(window.location.href.indexOf("#") + 1)
                }

                // mobile menu : title : toggle

                var mobileMenu = document.createElement("nav")
                mobileMenu.classList.value = "navbar navbar-expand-lg d-lg-none navbar-light sticky-top"
                mobileMenu.style.backgroundColor = contents.theme

                var mobileMenuContainer = document.createElement("div")
                mobileMenuContainer.classList.value = "container"

                var mobileMenuContainerTitle = document.createElement("a")
                mobileMenuContainerTitle.classList.value = "navbar-brand"
                mobileMenuContainerTitle.style.color = contents.highlight
                mobileMenuContainerTitle.innerHTML = contents.title
                mobileMenuContainer.append(mobileMenuContainerTitle)

                var mobileMenuContainerToggle = document.createElement("button")
                mobileMenuContainerToggle.classList.value = "navbar-toggler"
                mobileMenuContainerToggle.setAttribute("onclick", "var dropdown = document.getElementById('marksite-dropdown'); if (dropdown.classList.contains('d-none')) { dropdown.classList.remove('d-none'); window.scrollTo({ top: 0, left: 0 }) } else { dropdown.classList.add('d-none') }")
                mobileMenuContainerToggle.innerHTML = "<span class='navbar-toggler-icon'></span>"
                mobileMenuContainer.append(mobileMenuContainerToggle)

                mobileMenu.append(mobileMenuContainer)

                // mobile menu : links : pages

                var mobileDropdown = document.createElement("nav")
                mobileDropdown.id = "marksite-dropdown"
                mobileDropdown.classList.value = "d-lg-none navbar navbar-expand-lg navbar-light bg-white d-none p-0"

                var mobileDropdownContainer = document.createElement("div")
                mobileDropdownContainer.style.width = "100%"

                var mobileDropdownList = document.createElement("div")
                mobileDropdownList.classList.value = "list-group list-group-flush";
                mobileDropdownList.style.width = "100%"

                Object.entries(contents.links).forEach(n => {

                    var link = document.createElement("div")
                    link.classList.value = "list-group-item px-0"
                    link.style.borderBottom = `1px solid ${contents.theme}`
                    link.style.color = contents.highlight
                    link.style.cursor = "pointer"
                    link.setAttribute("href", n[1])
                    
                    var linkText = document.createElement("div")
                    linkText.classList.value = "container py-2"
                    linkText.style.opacity = 3/4
                    linkText.setAttribute("onmouseover", "this.style.opacity = 1")
                    linkText.setAttribute("onmouseout", "this.style.opacity = 3/4")
                    linkText.innerHTML = n[0]

                    link.append(linkText)
                    mobileDropdownList.append(link)

                })

                Object.entries(contents.pages).forEach(n => {

                    var link = document.createElement("div")
                    link.classList.value = "list-group-item px-0"
                    link.style.borderBottom = `1px solid ${contents.theme}`
                    link.style.cursor = "pointer"
                    if (n[1] == page) {
                        link.style.backgroundColor = contents.theme
                        link.style.color = contents.highlight
                    }
                    link.setAttribute("onmouseover", `this.style.backgroundColor = "${contents.theme}"; this.style.color = "${contents.highlight}"`)
                    link.setAttribute("onmouseout", n[1] != page ? "this.style.backgroundColor = ''; this.style.color = ''" : "")
                    link.setAttribute("onclick", `marksite('${n[1]}')`)

                    var linkText = document.createElement("div")
                    linkText.classList.value = "container py-2"
                    linkText.innerHTML = n[0]

                    link.append(linkText)
                    mobileDropdownList.append(link)
                    
                })

                mobileDropdownContainer.append(mobileDropdownList)
                mobileDropdown.append(mobileDropdownContainer)

                // desktop menu : title

                var menu = document.createElement("nav")
                menu.classList.value = "navbar navbar-expand-lg d-lg-block collapse"
                menu.style.backgroundColor = contents.theme

                var menuContainer = document.createElement("div")
                menuContainer.classList.value = "container"

                menuContainerTitle = document.createElement("a")
                menuContainerTitle.classList.value = "navbar-brand"
                menuContainerTitle.style.color = contents.highlight
                menuContainerTitle.innerHTML = contents.title
                menuContainer.append(menuContainerTitle)

                menu.append(menuContainer)

                // desktop menu : pages

                var pages = document.createElement("nav")
                pages.id = "marksite-pages"
                pages.classList.value = "navbar navbar-expand-lg d-lg-block collapse navbar-light sticky-top bg-white py-0"
                pages.style.borderBottom = `1px solid ${contents.theme}`
                pages.style.zIndex = 1000

                var pagesContainer = document.createElement("div")
                pagesContainer.classList.value = "container"

                var pagesLinks = document.createElement("div")
                pagesLinks.classList.value = "navbar-nav gap-4";

                Object.entries(contents.pages).forEach((n, i) => {
                    var block = document.createElement("div")
                    if (i != 0) {
                        block.classList.value = "ms-2"
                    }
                    block.style.cursor = "pointer"
                    var link = document.createElement("a")
                    link.classList.value = "nav-item nav-link py-3 px-0"
                    link.style.color = contents.highlight
                    link.setAttribute("onclick", `marksite('${n[1]}')`)
                    link.innerHTML = n[0]
                    if (n[1] == page) {
                        block.style.borderBottom = `1px solid ${contents.highlight}`
                        block.style.marginBottom = "-1px"
                    } else {
                        link.style.opacity = 3/4
                        link.setAttribute("onmouseover", `this.style.opacity = 1`)
                        link.setAttribute("onmouseout", "this.style.opacity = 3/4")
                        block.setAttribute("onmouseover", `this.style.marginBottom = '-1px'; this.style.borderBottom = '1px solid ${contents.highlight}'`)
                        block.setAttribute("onmouseout", "this.style.borderBottom = ''")
                    }
                    block.append(link)
                    pagesLinks.append(block)
                })

                pagesContainer.append(pagesLinks)
                pages.append(pagesContainer)

                // content

                var content = document.createElement("div")
                content.classList.value = "container d-flex"

                // content : table of contents : markdown : links

                var markdown = document.createElement("div")
                markdown.classList.value = "px-5 py-5 mx-5"
                markdown.style.width = "100%"
                markdown.style.borderLeft = `1px solid ${contents.theme}`
                markdown.style.borderRight = `1px solid ${contents.theme}`
                markdown.innerHTML = marked.parse(contents.notfound)

                var table = document.createElement("div")
                table.id = "marksite-table"
                table.classList.value = "d-lg-block collapse col-2 sticky-top align-self-start py-5"
                table.style.cursor = "pointer"
                table.style.zIndex = 999

                var rawF = new XMLHttpRequest()
                rawF.open("GET", `pages/${page}.md`, false)
                rawF.onreadystatechange = function () {
                    if (rawF.readyState === 4) {
                        if (rawF.status === 200 || rawF.status == 0) {

                            var allText = rawF.responseText
                            const parsed = marked.parse(allText)
                            markdown.innerHTML = parsed

                            parsed.split("\n").forEach((n, i) => {
                                if (["<h1", "<h2", "<h3", "<h4", "<h5"].filter(s => n.startsWith(s)).length) {
                                    
                                    var section = document.createElement("div")
                                    section.style.color = contents.highlight

                                    var sectionText = document.createElement("div")
                                    if (i != 0) {
                                        sectionText.classList.value = "py-3"
                                    } else {
                                        sectionText.classList.value = "pb-3"
                                    }
                                    sectionText.style.opacity = 3/4
                                    sectionText.setAttribute("onmouseover", "this.style.opacity = 1")
                                    sectionText.setAttribute("onmouseout", "this.style.opacity = 3/4")
                                    sectionText.setAttribute("onclick", `document.getElementById('${n.substring(n.indexOf('id="') + 'id="'.length, n.indexOf('">'))}').scrollIntoView({behavior: "smooth", block: "center"})`)
                                    sectionText.innerHTML = n.substring(n.indexOf('">') + '">'.length, n.indexOf('</'))
                                    
                                    section.append(sectionText)
                                    table.append(section)

                                }
                            })

                        }
                    }
                }
                rawF.send(null)

                var links = document.createElement("div")
                links.id = "marksite-links"
                links.classList.value = "d-lg-block collapse col-2 sticky-top align-self-start py-5"
                links.style.cursor = "pointer"
                links.style.zIndex = 999

                Object.entries(contents.links).forEach((n, i) => {

                    var link = document.createElement("a")
                    link.style.textDecoration = "none"
                    link.setAttribute("href", n[1])

                    var section = document.createElement("div")
                    section.style.color = contents.highlight

                    var sectionText = document.createElement("div")
                    if (i != 0) {
                        sectionText.classList.value = "py-3"
                    } else {
                        sectionText.classList.value = "pb-3"
                    }
                    sectionText.style.opacity = 3/4
                    sectionText.setAttribute("onmouseover", "this.style.opacity = 1")
                    sectionText.setAttribute("onmouseout", "this.style.opacity = 3/4")
                    sectionText.innerHTML = n[0]
                    
                    section.append(sectionText)
                    link.append(section)
                    links.append(link)

                })

                var download = document.createElement("div")
                download.style.color = "#f95448"
                download.setAttribute("onclick", "")

                var downloadText = document.createElement("div")
                downloadText.classList.value = "py-3"
                downloadText.style.opacity = 3/4
                downloadText.setAttribute("onmouseover", "this.style.opacity = 1")
                downloadText.setAttribute("onmouseout", "this.style.opacity = 3/4")
                downloadText.innerHTML = contents.download
                
                content.append(table)

                download.append(downloadText)
                links.append(download)

                content.append(markdown)
                if (markdown.innerHTML != marked.parse(contents.notfound)) {
                    content.append(links)
                }

                // footer

                var footer = document.createElement("footer")
                footer.classList.value = "bg-white py-4"
                footer.style.borderTop = `1px solid ${contents.theme}`

                var footerContainer = document.createElement("div")
                footerContainer.classList.value = "d-flex text-center flex-column flex-lg-row gap-2 container justify-content-between"

                var footerText = document.createElement("div")
                footerText.style.color = contents.highlight
                footerText.style.opacity = 3/4
                footerText.innerHTML = contents.author
                footerContainer.append(footerText)

                var footerLink = document.createElement("a")
                footerLink.style.textDecoration = "none"
                footerLink.style.color = contents.highlight
                footerLink.style.opacity = 3/4
                footerLink.setAttribute("onmouseover", "this.style.opacity = 1")
                footerLink.setAttribute("onmouseout", "this.style.opacity = 3/4")
                footerLink.setAttribute("href", "https://thorlindberg.com/marksite")
                footerLink.innerHTML = "Generated with marksite.js"
                footerContainer.append(footerLink)

                footer.append(footerContainer)

                // body

                var body = document.body
                body.style.fontFamily = contents.font
                body.innerHTML = ""

                // compiling

                body.append(mobileMenu)
                body.append(mobileDropdown)
                body.append(menu)
                body.append(pages)
                body.append(content)
                body.append(footer)

                // sticky table + links position

                document.getElementById("marksite-table").style.top = `${document.getElementById("marksite-table").offsetTop - document.getElementById("marksite-pages").offsetTop}px`
                window.addEventListener('resize', event => document.getElementById("marksite-table").style.top = `${document.getElementById("marksite-table").offsetTop - document.getElementById("marksite-pages").offsetTop}px`);

                document.getElementById("marksite-links").style.top = `${document.getElementById("marksite-links").offsetTop - document.getElementById("marksite-pages").offsetTop}px`
                window.addEventListener('resize', event => document.getElementById("marksite-links").style.top = `${document.getElementById("marksite-links").offsetTop - document.getElementById("marksite-pages").offsetTop}px`);

            }
        }
    }
    rawFile.send(null)

}
