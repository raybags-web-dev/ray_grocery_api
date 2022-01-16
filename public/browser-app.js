const allLinks = document.querySelectorAll("a");
const add_item = document.querySelector(".add-button-wrapper");
const add_item_container = document.querySelector(".add-wrapper");
//form button
const done_button = document.querySelector(".done-btn");
const add_btn = document.querySelector(".add-item-btn");
// form
const formDOM = document.querySelector("#add_item");
// main-container
const loadingDOM = document.querySelector(".results-wrapper");
const update_heading = document.querySelector("#update_heading");

// left panel
const left_panel = document.querySelector(".update-container-1");
const right_panel = document.querySelector(".update-container-2");
// search anchor
const search_input = document.getElementById("search-input");



// prevent links for reloading page
allLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
    })
})

// show edit form container
add_item.addEventListener("click", function() {
        add_item_container.classList.remove("hidden");
    })
    // remove edit form container
done_button.addEventListener("click", function(e) {
    e.preventDefault();
    add_item_container.classList.add("hidden");
})

// clear grocery container
function emptyContainer(element) {
    try {
        let children = Array.prototype.slice.call(element.childNodes);
        children.forEach(function(child) {
            if (!child) return;
            element.removeChild(child);
        });
    } catch (e) {
        console.log("empty grocery list");
    }
}

// Load groceries from /api/groceries
const showgroceries = async() => {
    loadingDOM.classList.remove("hidden");
    try {
        const { data: groceries } = await axios.get('/raybags.com/api/grocery-manager/v1/groceries')
            .catch((err) => {
                if (err.response) {
                    const { status, statusText } = err.response;
                    if (status == 404 && statusText == "Not Found") {
                        update_heading.textContent = "nothing to show";
                        emptyContainer(loadingDOM);
                        console.warn(err.response.data.message)
                        throw new Error("nothing found...")
                    }

                }
            });

        const allgroceries = groceries
            .map((grocery) => {
                const { name, department, _id: groceryId, term, details, createdAt, updatedAt } = grocery;
                return `
                        <div id="result-card" class="result-card" data-id="${groceryId}">
                        <div class="card-info">
                            <p>Name: ${name}</p>
                            <p>Term: ${term}</p>
                            <p>Details: ${details}</p>
                        </div>
                        <div class="card-timeline">
                            <i class="far fa-edit"></i>
                            <p>Created: ${createdAt}</p>
                            <p>Updated: ${updatedAt}</p>
                            <p>Department: ${department}</p>
                            <i id="deletee" class="fas fa-trash delete-btn"></i>
                        </div>
                    </div>
                `
            }).join('');

        loadingDOM.innerHTML = allgroceries;
    } catch (error) {
        console.warn(`Sorry there are no items in your storage`);
    }

}
showgroceries();
// delete task /api/groceries/:id
loadingDOM.addEventListener('click', async function(e) {
    const el = e.target;
    if (el.classList.contains('delete-btn')) {
        let grocery_to_be_deleted = (el.parentNode).parentNode;

        const id = grocery_to_be_deleted.dataset.id;

        try {
            await axios.delete(`/raybags.com/api/grocery-manager/v1/groceries/${id}`)
                .catch((err) => {
                    if (err.response) {
                        const { status } = err.response;
                        if (status == 404) return console.log("nothing found");
                    }
                });

            await showgroceries();
        } catch (error) {
            console.log(error.message);
        }
    }
})


// updates
const create_update = function(ele) {
    let newP = document.createElement("p");
    newP.className += "animate-update";
    let textNode = document.createTextNode(`${ele}: successfully added`);
    newP.appendChild(textNode);
    right_panel.appendChild(newP);

    setTimeout(() => newP.classList.add("hidden"), 3000)
}

// add item
const valueHandles = () => {
    let name_value = document.getElementById("name_val"),
        term_value = document.getElementById("word_val"),
        dep_value = document.getElementById("dep_val"),
        textarea_value = document.getElementById("textarea_val");

    let checkArr = [name_value, term_value, dep_value, textarea_value];
    checkArr.forEach((value) => value.addEventListener("focusin", (e) => e.target.offsetParent.autocomplete = "off"))
    return checkArr;
};

formDOM.addEventListener('submit', async(e) => {
    e.preventDefault();
    // inputs
    const [name_value, term_value, dep_value, textarea_value] = valueHandles();

    const name = name_value.value,
        term = term_value.value,
        department = dep_value.value,
        details = textarea_value.value;

    try {
        await axios.post('/raybags.com/api/grocery-manager/v1/groceries/', { name, term, department, details });
        showgroceries();

        create_update(`${name}}`);
        create_update(`${term}`);
        create_update(`${department}`);
        create_update(`${details}`);


        // clear values
        document.getElementById("name_val").value = ""
        document.getElementById("word_val").value = ""
        document.getElementById("dep_val").value = ""
        document.getElementById("textarea_val").value = ""


    } catch (error) {
        console.warn(error);
    }
});


// filter functionality 
const filterItems = () => {
    // get value of input
    let filterInput = search_input.value.toUpperCase();
    search_input.addEventListener("focusin", (e) => e.target.offsetParent.autocomplete = "off");
    // main content container
    let main_container = loadingDOM;
    // card items
    let inner_para = main_container.querySelectorAll(".result-card .card-info");
    // loop through paragraphs 
    for (let i = 0; i < inner_para.length; i++) {
        let p = inner_para[i].getElementsByTagName("p")[0];

        if (p.innerHTML.toUpperCase().indexOf(filterInput) > -1) {
            inner_para[i].parentElement.style.display = ""
        } else {
            inner_para[i].parentElement.style.display = "none"

        }
    }
}

search_input.addEventListener('keyup', filterItems);