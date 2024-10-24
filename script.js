const loadDepartmentsAndPositions = () => {
    fetch('/departments')
        .then(response => response.json())
        .then(data => {
            const departmentSelects = document.querySelectorAll('#department, #project-department');
            departmentSelects.forEach(select => {
                data.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.department_id;
                    option.textContent = dept.department_name;
                    select.appendChild(option);
                });
            });
        });

    fetch('/positions')
        .then(response => response.json())
        .then(data => {
            const positionSelects = document.querySelectorAll('#position');
            positionSelects.forEach(select => {
                data.forEach(pos => {
                    const option = document.createElement('option');
                    option.value = pos.position_id;
                    option.textContent = pos.position_name;
                    select.appendChild(option);
                });
            });
        });
};

loadDepartmentsAndPositions();

fetch('/tables')
    .then(response => response.json())
    .then(data => {
        const tablesContainer = document.getElementById('tables-container');
        data.tables.forEach(tableData => {
            const tableTitle = document.createElement('h3');
            tableTitle.textContent = tableData.table;
            tablesContainer.appendChild(tableTitle);

            const tableElement = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            if (tableData.rows.length > 0) {
                const headers = Object.keys(tableData.rows[0]);
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                const th = document.createElement('th');
                th.textContent = 'Actions';
                headerRow.appendChild(th);
                thead.appendChild(headerRow);
            }

            tableData.rows.forEach(row => {
                const rowElement = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    rowElement.appendChild(td);
                });
                const td = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => deleteRow(tableData.table, row[Object.keys(row)[0]]));
                td.appendChild(deleteButton);
                rowElement.appendChild(td);
                tbody.appendChild(rowElement);
            });

            tableElement.appendChild(thead);
            tableElement.appendChild(tbody);
            tablesContainer.appendChild(tableElement);
        });
    })
    .catch(error => console.error('Error fetching tables:', error));

const deleteRow = (table, id) => {
    fetch(`/delete/${table}/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            location.reload();
        } else {
            console.error('Error deleting row:', result.error);
        }
    })
    .catch(error => console.error('Error deleting row:', error));
};

document.querySelectorAll('.data-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        const endpoint = '/' + this.closest('.form-container').id.replace('-form', '');
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Data added:', result);
            location.reload();
        })
        .catch(error => console.error('Error adding data:', error));
    });
});

document.getElementById('form-selector').addEventListener('change', function() {
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.remove('active');
    });
    const selectedForm = document.getElementById(this.value + '-form');
    if (selectedForm) {
        selectedForm.classList.add('active');
    }
});
