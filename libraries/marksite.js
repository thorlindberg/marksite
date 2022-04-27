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

                // desktop menu : title : links

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

                var menuLinks = document.createElement("div")
                menuLinks.classList.value = "navbar-nav gap-4"
                menuLinks.style.marginLeft = "auto";

                Object.entries(contents.links).forEach(n => {
                    var link = document.createElement("a")
                    link.classList.value = "nav-item nav-link pe-0"
                    link.style.color = contents.highlight
                    link.style.opacity = 3/4
                    link.setAttribute("onmouseover", "this.style.opacity = 1")
                    link.setAttribute("onmouseout", "this.style.opacity = 3/4")
                    link.setAttribute("href", n[1])
                    link.innerHTML = n[0]
                    menuLinks.append(link)
                })

                menuContainer.append(menuLinks)
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
                content.classList.value = "container d-flex py-3 py-lg-5 gap-5"

                // content : markdown : table of contents

                var markdownContainer = document.createElement("div")
                markdownContainer.classList.value = "pe-lg-5 py-4"
                markdownContainer.style.width = "100%"

                var markdown = document.createElement("div")
                markdown.classList.value = "pe-lg-5"
                markdown.innerHTML = marked.parse(contents.notfound)

                var table = document.createElement("div")
                table.id = "marksite-table"
                table.classList.value = "d-lg-block collapse py-4 sticky-top align-self-start"
                table.style.width = "auto"
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

                            parsed.split("\n").forEach(n => {
                                if (["<h1", "<h2", "<h3", "<h4", "<h5"].filter(s => n.startsWith(s)).length) {
                                    
                                    var section = document.createElement("div")
                                    section.style.whiteSpace = "nowrap"
                                    section.style.overflow = "hidden"
                                    section.style.textOverflow = "ellipsis"
                                    section.style.color = contents.highlight
                                    section.style.borderLeft = `3px solid ${contents.theme}`
                                    section.setAttribute("onmouseover", `this.style.borderLeft = "3px solid ${contents.highlight}"`)
                                    section.setAttribute("onmouseout", `this.style.borderLeft = "3px solid ${contents.theme}"`)

                                    var sectionText = document.createElement("div")
                                    sectionText.classList.value = "ps-4 pe-0 py-3"
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

                var download = document.createElement("div")
                download.classList.value = "mt-5"
                download.style.whiteSpace = "nowrap"
                download.style.overflow = "hidden"
                download.style.textOverflow = "ellipsis"
                download.style.color = "#f95448"
                download.style.borderLeft = "3px solid #fededc"
                download.setAttribute("onmouseover", "this.style.borderLeft = '3px solid #f95448'")
                download.setAttribute("onmouseout", "this.style.borderLeft = '3px solid #fededc'")

                var downloadText = document.createElement("div")
                downloadText.classList.value = "ps-4 pe-0 py-3"
                downloadText.style.opacity = 3/4
                downloadText.setAttribute("onmouseover", "this.style.opacity = 1")
                downloadText.setAttribute("onmouseout", "this.style.opacity = 3/4")
                downloadText.setAttribute("onclick", "")
                downloadText.innerHTML = `${contents.download}&emsp;<svg width="12" height="15" viewBox="0 0 60 74" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Regular-S"><path id="Path" fill="#f95448" stroke="none" d="M 29.842529 0.417969 C 28.703247 0.417969 27.759155 0.78418 27.010498 1.516602 C 26.261841 2.249023 25.887451 3.184937 25.887451 4.324219 L 25.887451 53.005859 L 26.375732 65.017578 L 28.865845 64.138672 L 14.071045 47.683594 L 7.088623 40.896484 C 6.763062 40.570923 6.356201 40.310547 5.86792 40.115234 C 5.379639 39.919922 4.875122 39.822266 4.354248 39.822266 C 3.247437 39.822266 2.335938 40.196655 1.619751 40.945313 C 0.903687 41.69397 0.545654 42.605469 0.545654 43.679688 C 0.545654 44.721313 0.952515 45.681641 1.766357 46.560547 L 26.912842 71.755859 C 27.759155 72.667358 28.735718 73.123047 29.842529 73.123047 C 30.949341 73.123047 31.925903 72.667358 32.772217 71.755859 L 57.918701 46.560547 C 58.732544 45.681641 59.139404 44.721313 59.139404 43.679688 C 59.139404 42.605469 58.781372 41.69397 58.065186 40.945313 C 57.348999 40.196655 56.4375 39.822266 55.330811 39.822266 C 54.809937 39.822266 54.30542 39.919922 53.817139 40.115234 C 53.328857 40.310547 52.921997 40.570923 52.596436 40.896484 L 45.614014 47.683594 L 30.770142 64.138672 L 33.309326 65.017578 L 33.797607 53.005859 L 33.797607 4.324219 C 33.797607 3.184937 33.423218 2.249023 32.674561 1.516602 C 31.925903 0.78418 30.981812 0.417969 29.842529 0.417969 Z"/></g></svg>`
                
                download.append(downloadText)
                table.append(download)

                markdownContainer.append(markdown)
                content.append(markdownContainer)
                if (markdown.innerHTML != marked.parse(contents.notfound)) {
                    content.append(table)
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

                // sticky table position

                document.getElementById("marksite-table").style.top = `${document.getElementById("marksite-table").offsetTop - document.getElementById("marksite-pages").offsetTop}px`
                window.addEventListener('resize', event => document.getElementById("marksite-table").style.top = `${document.getElementById("marksite-table").offsetTop - document.getElementById("marksite-pages").offsetTop}px`);

            }
        }
    }
    rawFile.send(null)

}
