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
        const pairDiv = document.createElement('div');
        pairDiv.className = 'data-pair';

        const variableDiv = document.createElement('div');
        variableDiv.className = 'variable';
        variableDiv.textContent = column.replace(/_/g, ' ');

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.id = `live-${column}`;
        valueDiv.textContent = '--';

        pairDiv.appendChild(variableDiv);
        pairDiv.appendChild(valueDiv);
        container.appendChild(pairDiv);
    });
}

async function fetchLatestEntry() {
    try {
        const response = await fetch('/api/latest_entry');
        if (!response.ok) return;

        const data = await response.json();

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
        }
    } catch (error) {
        console.error('Error fetching latest entry:', error);
    }
}

initializeLiveDataDisplay();
liveDataInterval = setInterval(fetchLatestEntry, 1000);