let liveDataInterval = null;
const allColumns = [
    "Timestamp", "Outdoor_Temp_C", "Outdoor_Humidity", "Wind_Speed_m_s", "Water_Inlet_Temp_C",
    "Water_Outlet_Temp_C", "Air_Temp_C", "Water_Flow_Rate_L_s", "Air_Velocity_m_s",
    "Cooling_Tower_Efficiency", "Cooling_Capacity_kW", "Energy_Consumption_kWh", "Kp", "Ki", "Kd",
    "Error_C", "Setpoint_Temp_C", "Best_Solution_Found", "Fitness_Value", "Iteration_Number",
    "PID_Output", "Energy_Savings", "Water_Consumption_L", "CO2_Emissions_kg", "Sensor_Status",
    "System_Operational_Mode"
];

function initializeLiveDataDisplay() {
    const container = document.getElementById('live-data-entry');
    container.innerHTML = '';
    allColumns.forEach(column => {
        const pointDiv = document.createElement('div');
        pointDiv.className = 'live-data-point';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'data-label';
        labelSpan.textContent = column.replace(/_/g, ' ');

        const valueSpan = document.createElement('span');
        valueSpan.className = 'data-value';
        valueSpan.id = `live-${column}`;
        valueSpan.textContent = '--';

        pointDiv.appendChild(labelSpan);
        pointDiv.appendChild(valueSpan);
        container.appendChild(pointDiv);
    });
}

async function fetchLatestEntry() {
    try {
        const response = await fetch('/api/latest_entry');
        if (!response.ok) return;

        const data = await response.json();
        const liveDataContainer = document.getElementById('live-data-container');

        if (data.latest_entry) {
            for (const key in data.latest_entry) {
                const valueElement = document.getElementById(`live-${key}`);
                if (valueElement) {
                    let value = data.latest_entry[key];
                    if (typeof value === 'number' && !Number.isInteger(value)) {
                        value = value.toFixed(2);
                    }
                    valueElement.textContent = value;
                }
            }
            
            liveDataContainer.classList.add('flashing');
            setTimeout(() => {
                liveDataContainer.classList.remove('flashing');
            }, 1000);
        }
    } catch (error) {
        console.error('Error fetching latest entry:', error);
    }
}

initializeLiveDataDisplay();
liveDataInterval = setInterval(fetchLatestEntry, 1000);