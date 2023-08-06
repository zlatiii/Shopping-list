//We can select from UL using querySelectorAll('li')
//We can call querySelector on items that are in the doc
//e.target is not clear yet
//Try accessing elements suing children
//QUERY SELECT BY CLASS items.querySelector('.edit-mode')
//The video again


// Add item to the list
const form = document.querySelector('#item-form');
const items = document.querySelector('#item-list');
const input = document.querySelector('#item-input');
const clearBtn = document.querySelector('#clear');
const filter = document.querySelector('#filter');
let isEditMode = false;
const editBtn = form.querySelector('button');

//Function


function addItemSubmit (e){
    e.preventDefault();
    const newItem = input.value;
    if(newItem === ''){
        alert('Please, add an item' )
        return;
    }

    //Check if we are in the edit mode
    if (isEditMode){
        //Remove item from the local storage
        const itemToEdit = items.querySelector('.edit-mode')
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('.edit-mode');
        //Remove from the DOM
        itemToEdit.remove();
        isEditMode = false;
        //Add new item 
    }else{
        if (checkIfItemExists(newItem)){
            alert('The item is already in the list!');
        }}
    

    addItemToDom(newItem);
    addItemToStorage(newItem);

    checkUI()

    input.value = ' ';
}

function getItemsFromStorage(){
    let itemsFromStorage;
    //Check if there are items in the storage
    if (localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return(itemsFromStorage);
    
}

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item =>
        addItemToDom(item));
    checkUI();
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();
    //Add new item to an array
    itemsFromStorage.push(item);
    //Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function addItemToDom(item){
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item));
    const button = createBtn('remove-item btn-link text-red');
    li.appendChild(button)
    //Add new li to the DOM
    items.appendChild(li);
}


function createBtn(buttonClass){
    const btn = document.createElement('button')
    btn.className = buttonClass;
    const icon = createIcon('fa-solid fa-xmark');
    btn.appendChild(icon)
    return btn;
}


function createIcon(iconClass){
    const icon = document.createElement('icon')
    icon.className = iconClass;
    return icon;
}


function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }else{ 
        setItemToEdit(e.target)
    }
}


function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    if (itemsFromStorage.includes(item)){
        return true;
    }else{
        return false;
    }
}


function setItemToEdit(item){
    isEditMode = true; 
    //Make sure that we only edit one item at a time
    items
    .querySelectorAll('li')
    .forEach(i => {
        i.classList.remove('edit-mode');
    })
    //Select item to edit
    item.classList.add('edit-mode');
    editBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> Update item';
    editBtn.style.backgroundColor = '#228B22'
    input.value = item.textContent;

}

function removeItem(item){
    if (confirm('Are you sure?')){
        item.remove();
        //Remove item from local storage
        removeItemFromStorage(item.textContent)
        checkUI();
    }
}


function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter(i =>
        i !== item);
    //Reset local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(){
    while(items.firstChild){
        items.removeChild(items.firstChild);
        checkUI();
    }
}


function checkUI(){

    input.value = '';

    const itemsList = items.querySelectorAll('li');
    if (itemsList.length === 0){
            clearBtn.style.display = 'none';
            filter.style.display = 'none';
    }else{
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
    }
    isEditMode = false;

    editBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add item';
    editBtn.style.backgroundColor = '#333'
}

//Do this one again, on your own. Cause it's dynamic!
function filterItems(e){
    const itemsList = items.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    itemsList.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    })
}


// Initialize app
function init(){
        // Add event listeners
        form.addEventListener('submit', addItemSubmit);
        items.addEventListener('click', onClickItem);
        clearBtn.addEventListener('click', clearItems);
        filter.addEventListener('input', filterItems);
        document.addEventListener('DOMContentLoaded', displayItems);

        checkUI()
}

init();