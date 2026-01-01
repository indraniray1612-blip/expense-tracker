const expForm = document.querySelector("#expense-form");
const expName = document.querySelector("#expense-name");
const expAmount = document.querySelector("#expense-amount");
const expType = document.querySelector("#expense-type");
const expDate = document.querySelector("#expense-date");
const totalSpends = document.querySelector("#total-spends");
const expList = document.querySelector("#expense-list");
const addBtn = document.querySelector("#add-btn");

let expenses = [];
let editIndex = null;

expForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let trimmedName = expName.value.trim();

    if(trimmedName === "") {
        alert("Expense name cannot be empty.");
        return;
    }
    else if(Number(expAmount.value) <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }
    else if(expType.value === "") {
        alert("Please select a category.");
        return;
    }
    else if(expDate.value === "") {
        alert("Please enter the date of purchase.");
        return;
    }

    let expense = {
        name : trimmedName,
        amount : Number(expAmount.value),
        category : expType.value,
        date : expDate.value
    };

    if(editIndex === null) {
        expenses.push(expense);
    } else {
        expenses[editIndex] = expense;
        editIndex = null;
        addBtn.innerText = "Add Expense";
    }

    expForm.reset();

    renderList();

    saveData();
});

function renderList() {
    expList.innerHTML = "";

    expenses.forEach((exp, idx) => {
        const tr = document.createElement("tr");

        if (idx === editIndex) {
            tr.classList.add("highlight");
        }

        tr.innerHTML = `
            <td>${exp.name}</td>
            <td>${exp.amount}</td>
            <td>${exp.category}</td>
            <td>${exp.date}</td>
            <td class="actions"></td>
        `;

        const actionsTd = tr.querySelector(".actions");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = () => editRow(idx);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("dlt-btn");
        deleteBtn.onclick = () => deleteRow(idx);

        actionsTd.append(editBtn, deleteBtn);

        expList.appendChild(tr);
    });

    findTotal();
}


function findTotal () {
    let total = 0;
    expenses.forEach((exp) => {
        total += exp.amount;
    });

    totalSpends.textContent = total;
}

function deleteRow(index) {
    const confirmDelete = confirm("Are you sure you want to delete this expense?");

    if(!confirmDelete) return;
    
    expenses.splice(index,1);

    renderList();

    saveData();
}

function saveData() {
    localStorage.setItem("expenses",JSON.stringify(expenses));
}

window.addEventListener("load", () => {
    let storedItem = localStorage.getItem("expenses");

    if(storedItem) {
        expenses = JSON.parse(storedItem);

        renderList();
    }
});

function editRow(index) {
    let exp = expenses[index];

    expName.value = exp.name;
    expAmount.value = exp.amount;
    expType.value = exp.category;
    expDate.value = exp.date;

    editIndex = index;

    addBtn.innerText = "Update Expense";

    renderList();
}