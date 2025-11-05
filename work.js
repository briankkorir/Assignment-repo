        const shipments = [
            { id: 'SH-12345', origin: 'Seattle, WA', destination: 'New York, NY', status: 'In Transit', priority: 'High', carrier: 'FedEx Express', delivery: 'Mar 15, 2025' },
            { id: 'SH-67890', origin: 'Dallas, TX', destination: 'Los Angeles, CA', status: 'Delayed', priority: 'High', carrier: 'UPS Next Day', delivery: 'Mar 11, 2025' },
            { id: 'SH-24680', origin: 'Miami, FL', destination: 'Chicago, IL', status: 'Delivered', priority: 'Medium', carrier: 'DHL', delivery: 'Mar 12, 2025' },
            { id: 'SH-13579', origin: 'Boston, MA', destination: 'San Francisco, CA', status: 'Processing', priority: 'Low', carrier: 'USPS Priority', delivery: 'Mar 18, 2025' },
            { id: 'SH-97531', origin: 'Atlanta, GA', destination: 'Denver, CO', status: 'In Transit', priority: 'Medium', carrier: 'Amazon Logistics', delivery: 'Mar 13, 2025' }
        ];

        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.querySelector('input[placeholder="Search shipments..."]');
            const statusFilter = document.querySelector('select:nth-child(2)');
            const priorityFilter = document.querySelector('select:nth-child(3)');

            searchInput.addEventListener('input', filterShipments);
            statusFilter.addEventListener('change', filterShipments);
            priorityFilter.addEventListener('change', filterShipments);

            changePage(1);
        });

        function filterShipments() {
            const searchTerm = document.querySelector('input[placeholder="Search shipments..."]').value.toLowerCase();
            const statusFilter = document.querySelector('select:nth-child(2)').value;
            const priorityFilter = document.querySelector('select:nth-child(3)').value;

            const filteredShipments = shipments.filter(shipment => {
                const matchesSearch = 
                    shipment.id.toLowerCase().includes(searchTerm) ||
                    shipment.origin.toLowerCase().includes(searchTerm) ||
                    shipment.destination.toLowerCase().includes(searchTerm) ||
                    shipment.carrier.toLowerCase().includes(searchTerm);

                const matchesStatus = statusFilter === 'All Statuses' || shipment.status === statusFilter;
                const matchesPriority = priorityFilter === 'All Priorities' || shipment.priority === priorityFilter;

                return matchesSearch && matchesStatus && matchesPriority;
            });

            updateSummaryStats(filteredShipments);
            const totalPages = Math.ceil(filteredShipments.length / 2);
            updatePagination(totalPages);
            displayShipments(filteredShipments, 1);
        }

        function updateSummaryStats(filteredShipments) {
            const stats = {
                total: filteredShipments.length,
                'In Transit': 0,
                'Delivered': 0,
                'Processing': 0,
                'Delayed': 0
            };

            filteredShipments.forEach(shipment => {
                stats[shipment.status]++;
            });

            document.querySelectorAll('.stat-item').forEach(item => {
                const label = item.querySelector('.stat-label').textContent;
                const valueElement = item.querySelector('.stat-value');
                if (label === 'Total Shipments') {
                    valueElement.textContent = stats.total;
                } else {
                    valueElement.textContent = stats[label] || 0;
                }
            });
        }

        function updatePagination(totalPages) {
            const pagination = document.querySelector('.pagination');
            const buttons = pagination.querySelectorAll('.page-btn');

            for (let i = 1; i <= 3; i++) {
                buttons[i].style.display = i <= totalPages ? 'block' : 'none';
            }
        }

        function displayShipments(shipments, pageNumber) {
            const rowsPerPage = 2;
            const startIndex = (pageNumber - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const paginatedShipments = shipments.slice(startIndex, endIndex);

            const tableBody = document.getElementById('shipment-table-body');
            tableBody.innerHTML = '';

            paginatedShipments.forEach(shipment => {
                const row = document.createElement('tr');
                row.className = `priority-${shipment.priority.toLowerCase()}`;
                
                const statusClass = `status-${shipment.status.toLowerCase().replace(' ', '-')}`;
                
                row.innerHTML = `
                    <td><strong>${shipment.id}</strong></td>
                    <td>${shipment.origin}</td>
                    <td>${shipment.destination}</td>
                    <td><span class="status-badge ${statusClass}">${shipment.status}</span></td>
                    <td>${shipment.priority}</td>
                    <td>${shipment.carrier}</td>
                    <td class="date-upcoming">${shipment.delivery}</td>
                    <td class="actions">
                        <button class="action-btn">View</button>
                        <button class="action-btn">Track</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
            const activeButton = document.querySelector(`.page-btn:nth-child(${pageNumber + 1})`);
            if (activeButton) activeButton.classList.add('active');
        }

        function changePage(pageNumber) {
            const searchTerm = document.querySelector('input[placeholder="Search shipments..."]').value.toLowerCase();
            const statusFilter = document.querySelector('select:nth-child(2)').value;
            const priorityFilter = document.querySelector('select:nth-child(3)').value;

            const filteredShipments = shipments.filter(shipment => {
                const matchesSearch = 
                    shipment.id.toLowerCase().includes(searchTerm) ||
                    shipment.origin.toLowerCase().includes(searchTerm) ||
                    shipment.destination.toLowerCase().includes(searchTerm) ||
                    shipment.carrier.toLowerCase().includes(searchTerm);

                const matchesStatus = statusFilter === 'All Statuses' || shipment.status === statusFilter;
                const matchesPriority = priorityFilter === 'All Priorities' || shipment.priority === priorityFilter;

                return matchesSearch && matchesStatus && matchesPriority;
            });

            const totalPages = Math.ceil(filteredShipments.length / 2);
            
            if (pageNumber === 'first') pageNumber = 1;
            if (pageNumber === 'last') pageNumber = totalPages;

            displayShipments(filteredShipments, pageNumber);
        }
