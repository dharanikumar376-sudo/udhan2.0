// ==========================================================================
// JavaScript Logic: Smart Agro Digital Twin
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Navigation Menu ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, .btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // --- 2. Live Time Display in Hero Header ---
    const heroTime = document.getElementById('heroTime');
    if (heroTime) {
        setInterval(() => {
            const now = new Date();
            heroTime.textContent = now.toTimeString().split(' ')[0];
        }, 1000);
    }

    // --- 3. Tab Routing / Active State on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Dynamic Data Sources Panel & Integration Chart ---
    const sourceItems = document.querySelectorAll('.source-item');
    const sourceTitle = document.getElementById('sourceTitle');
    const feedLabel1 = document.getElementById('feedLabel1');
    const feedValue1 = document.getElementById('feedValue1');
    const feedLabel2 = document.getElementById('feedLabel2');
    const feedValue2 = document.getElementById('feedValue2');
    const feedLabel3 = document.getElementById('feedLabel3');
    const feedValue3 = document.getElementById('feedValue3');
    
    // Chart.js instance for the Data Sources section
    let sourceChartInstance = null;

    const sourceDataConfigs = {
        soil: {
            title: 'Soil Sensors Ingestion',
            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
            data: [35.2, 36.1, 35.8, 34.5, 34.0, 33.6, 35.4, 37.1, 38.2, 38.4],
            label: 'Moisture (%)',
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.15)',
            metrics: {
                l1: 'Soil Moisture', v1: '38.4%',
                l2: 'Nitrogen (N)', v2: '42 mg/kg',
                l3: 'Soil pH', v3: '6.7 pH'
            }
        },
        weather: {
            title: 'Weather Radar & Solar Feeds',
            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
            data: [24.1, 25.4, 27.2, 28.5, 29.1, 29.4, 28.8, 28.0, 26.5, 25.8],
            label: 'Ambient Temp (°C)',
            borderColor: '#ff7b00',
            backgroundColor: 'rgba(255, 123, 0, 0.15)',
            metrics: {
                l1: 'Solar Index', v1: '6.8 UV',
                l2: 'Relative Humidity', v2: '62%',
                l3: 'Barometric Press', v3: '1012 hPa'
            }
        },
        equipment: {
            title: 'Equipment Telemetry Logs',
            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
            data: [15, 18, 22, 22, 5, 0, 12, 18, 22, 10],
            label: 'Pump Pressure (PSI)',
            borderColor: '#00a2ff',
            backgroundColor: 'rgba(0, 162, 255, 0.15)',
            metrics: {
                l1: 'Tractor Status', v1: 'Active (Field C)',
                l2: 'Irrigation Flow', v2: '4.2 L/sec',
                l3: 'Grid Battery', v3: '94%'
            }
        },
        market: {
            title: 'Commodity Demand Index',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            data: [185, 192, 210, 205, 198, 215, 224, 230, 228, 234],
            label: 'Wheat Price ($/Ton)',
            borderColor: '#ffd000',
            backgroundColor: 'rgba(255, 208, 0, 0.15)',
            metrics: {
                l1: 'Corn Index', v1: '$165 / Ton',
                l2: 'Soybeans Index', v2: '$340 / Ton',
                l3: 'Global Demand', v3: 'High (+8.5%)'
            }
        }
    };

    function updateSourcePreview(sourceKey) {
        const config = sourceDataConfigs[sourceKey];
        if (!config) return;

        // Update titles and labels
        sourceTitle.textContent = config.title;
        feedLabel1.textContent = config.metrics.l1;
        feedValue1.textContent = config.metrics.v1;
        feedLabel2.textContent = config.metrics.l2;
        feedValue2.textContent = config.metrics.v2;
        feedLabel3.textContent = config.metrics.l3;
        feedValue3.textContent = config.metrics.v3;

        // Render Chart.js
        const ctx = document.getElementById('sourceChart').getContext('2d');
        if (sourceChartInstance) {
            sourceChartInstance.destroy();
        }

        sourceChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: config.labels,
                datasets: [{
                    label: config.label,
                    data: config.data,
                    borderColor: config.borderColor,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: config.borderColor
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    // Add click event for data sources menu sidebar
    sourceItems.forEach(item => {
        item.addEventListener('click', () => {
            sourceItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const sourceKey = item.getAttribute('data-source');
            updateSourcePreview(sourceKey);
        });
    });

    // Initialize default Data Source preview (soil)
    updateSourcePreview('soil');


    // --- 5. Digital Twin Map Layers & Diagnostics Interactivity ---
    const layerButtons = document.querySelectorAll('.layer-btn');
    const currentLayerText = document.getElementById('currentLayerText');
    const twinLegend = document.getElementById('twinLegend');
    const legendItems = document.getElementById('legendItems');
    const twinOverlayPanel = document.getElementById('twinOverlayPanel');
    const rainEffect = document.getElementById('rainEffect');
    const heatEffect = document.getElementById('heatEffect');

    // SVG elements
    const fieldA = document.getElementById('svgFieldA');
    const fieldB = document.getElementById('svgFieldB');
    const fieldC = document.getElementById('svgFieldC');
    const fieldD = document.getElementById('svgFieldD');
    const irrigationPipes = document.getElementById('svgIrrigationPipes');

    // Legend configurations for layers
    const layerLegends = {
        normal: `
            <div class="legend-item"><span class="legend-color normal-base"></span><span>Regular Fields</span></div>
            <div class="legend-item"><span class="legend-color normal-structure"></span><span>Farm Facilities</span></div>
        `,
        health: `
            <div class="legend-item"><span class="legend-color ndvi-optimal"></span><span>NDVI Optimal (High)</span></div>
            <div class="legend-item"><span class="legend-color ndvi-moderate"></span><span>NDVI Moderate (Nitrogen Demand)</span></div>
            <div class="legend-item"><span class="legend-color ndvi-poor"></span><span>NDVI Alert (Moisture Stress)</span></div>
        `,
        moisture: `
            <div class="legend-item"><span class="legend-color moist-saturated"></span><span>Saturated (50%+)</span></div>
            <div class="legend-item"><span class="legend-color moist-nominal"></span><span>Optimal (35-49%)</span></div>
            <div class="legend-item"><span class="legend-color moist-drought"></span><span>Drought Warning (<30%)</span></div>
        `,
        water: `
            <div class="legend-item"><span class="legend-color water-pipe"></span><span>Active Pipe Networks</span></div>
            <div class="legend-item"><span class="legend-color normal-structure"></span><span>Valve Nodes</span></div>
        `,
        weather: `
            <div class="legend-item"><span class="legend-color" style="background: rgba(0, 240, 255, 0.4)"></span><span>Precipitation Cloud</span></div>
            <div class="legend-item"><span class="legend-color" style="background: rgba(255, 123, 0, 0.3)"></span><span>Heat Dome Margin</span></div>
        `
    };

    function selectTwinLayer(layerKey) {
        // Reset SVG items visibility/styles
        rainEffect.style.opacity = '0';
        heatEffect.style.opacity = '0';
        irrigationPipes.setAttribute('opacity', '0');

        // Apply colors to fields depending on layer selected
        if (layerKey === 'normal') {
            currentLayerText.textContent = "Satellite Basemap";
            fieldA.setAttribute('fill', '#2ecc71');
            fieldB.setAttribute('fill', '#2ecc71');
            fieldC.setAttribute('fill', '#2ecc71');
            fieldD.setAttribute('fill', '#2ecc71');
        } 
        else if (layerKey === 'health') {
            currentLayerText.textContent = "NDVI Crop Health";
            fieldA.setAttribute('fill', 'url(#ndviHigh)');  // High
            fieldB.setAttribute('fill', 'url(#ndviMed)');   // Medium
            fieldC.setAttribute('fill', 'url(#ndviLow)');   // Low
            fieldD.setAttribute('fill', 'url(#ndviHigh)');  // High
        } 
        else if (layerKey === 'moisture') {
            currentLayerText.textContent = "Soil Moisture Grids";
            fieldA.setAttribute('fill', 'url(#moistureWet)'); // Wet
            fieldB.setAttribute('fill', 'url(#moistureDry)'); // Dry
            fieldC.setAttribute('fill', 'url(#moistureMid)'); // Nominal
            fieldD.setAttribute('fill', 'url(#moistureWet)'); // Wet
        } 
        else if (layerKey === 'water') {
            currentLayerText.textContent = "Irrigation Grids Overlay";
            fieldA.setAttribute('fill', '#1e3f20');
            fieldB.setAttribute('fill', '#1e3f20');
            fieldC.setAttribute('fill', '#1e3f20');
            fieldD.setAttribute('fill', '#1e3f20');
            irrigationPipes.setAttribute('opacity', '1');
        } 
        else if (layerKey === 'weather') {
            currentLayerText.textContent = "Live Weather Radar Overlay";
            fieldA.setAttribute('fill', '#2ecc71');
            fieldB.setAttribute('fill', '#2ecc71');
            fieldC.setAttribute('fill', '#2ecc71');
            fieldD.setAttribute('fill', '#2ecc71');
            
            // Show rain effect
            rainEffect.style.opacity = '1';
            heatEffect.style.opacity = '0.3';
        }

        // Update legend
        legendItems.innerHTML = layerLegends[layerKey];
    }

    layerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            layerButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const layerKey = btn.getAttribute('data-layer');
            selectTwinLayer(layerKey);
        });
    });

    // Handle clicks on interactive SVG elements (Fields and Sensors)
    const farmElements = document.querySelectorAll('.farm-element, .farm-hq, .farm-sensor');
    
    const diagnosticsData = {
        'Field A': {
            crop: 'Spring Wheat',
            health: 'Optimal (NDVI: 0.82)',
            moisture: '42.8%',
            temp: '26.4°C',
            nitrogen: '44 mg/kg',
            alerts: 'None'
        },
        'Field B': {
            crop: 'Maize (Corn)',
            health: 'Attention (NDVI: 0.61)',
            moisture: '21.5%',
            temp: '28.9°C',
            nitrogen: '29 mg/kg',
            alerts: 'Water Stress Alert: Evapotranspiration exceeds intake. Irrigation advised.'
        },
        'Field C': {
            crop: 'Soybeans',
            health: 'Alert (NDVI: 0.44)',
            moisture: '34.2%',
            temp: '27.1°C',
            nitrogen: '18 mg/kg',
            alerts: 'Low Soil Nitrogen levels. Early sign of pest activity detected by drones.'
        },
        'Field D': {
            crop: 'Winter Barley',
            health: 'Optimal (NDVI: 0.79)',
            moisture: '38.1%',
            temp: '25.9°C',
            nitrogen: '40 mg/kg',
            alerts: 'None'
        },
        'HQ': {
            title: 'AgroTwin Base Control HQ',
            description: 'Central computing hub routing field LoRa nodes. Subsystems online. Edge server ping: 12ms. Synced database status: OK.'
        },
        'SensorA': { title: 'Node Alpha-10 (Field A)', state: 'Battery 92%', reading: 'Moisture 42.8%, Temp 26.4°C, Status: OK' },
        'SensorB': { title: 'Node Beta-08 (Field B)', state: 'Battery 84%', reading: 'Moisture 21.5%, Temp 28.9°C, Status: Alert' },
        'SensorC': { title: 'Node Gamma-12 (Field C)', state: 'Battery 89%', reading: 'Moisture 34.2%, Temp 27.1°C, Status: OK' },
        'SensorD': { title: 'Node Delta-03 (Field D)', state: 'Battery 95%', reading: 'Moisture 38.1%, Temp 25.9°C, Status: OK' }
    };

    farmElements.forEach(el => {
        el.addEventListener('click', () => {
            let overlayHtml = '';

            if (el.classList.contains('farm-hq')) {
                const data = diagnosticsData['HQ'];
                overlayHtml = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h5><i class="fa-solid fa-server text-cyan"></i> ${data.title}</h5>
                            <p>${data.description}</p>
                        </div>
                        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="document.getElementById('twinOverlayPanel').style.display='none'">Close</button>
                    </div>
                `;
            } else if (el.classList.contains('farm-sensor')) {
                const nodeKey = el.getAttribute('data-node');
                const data = diagnosticsData['Sensor' + nodeKey];
                overlayHtml = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h5><i class="fa-solid fa-tower-broadcast text-orange"></i> ${data.title}</h5>
                            <p><strong>Status:</strong> ${data.state} | <strong>Live Feed:</strong> ${data.reading}</p>
                        </div>
                        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="document.getElementById('twinOverlayPanel').style.display='none'">Close</button>
                    </div>
                `;
            } else {
                // It is a field polygon group
                const infoAttr = el.getAttribute('data-info');
                const fieldName = infoAttr.split(':')[0];
                const data = diagnosticsData[fieldName];
                
                const alertClass = data.alerts === 'None' ? 'text-green' : 'text-red';
                const alertIcon = data.alerts === 'None' ? 'fa-circle-check' : 'fa-triangle-exclamation';

                overlayHtml = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
                        <div style="flex: 1;">
                            <h5 style="color: var(--primary);"><i class="fa-solid fa-map-location-dot"></i> ${fieldName} Diagnostics</h5>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                                <span><strong>Crop Type:</strong> ${data.crop}</span>
                                <span><strong>Soil Moisture:</strong> ${data.moisture}</span>
                                <span><strong>NDVI Health:</strong> ${data.health}</span>
                            </div>
                            <div style="margin-top: 10px;">
                                <span class="${alertClass}"><i class="fa-solid ${alertIcon}"></i> <strong>System Alerts:</strong> ${data.alerts}</span>
                            </div>
                        </div>
                        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; flex-shrink: 0;" onclick="document.getElementById('twinOverlayPanel').style.display='none'">Close</button>
                    </div>
                `;
            }

            twinOverlayPanel.innerHTML = overlayHtml;
            twinOverlayPanel.style.display = 'block';
        });
    });


    // --- 6. Prognostic Simulation Engine ---
    const simCrop = document.getElementById('simCrop');
    const simMoisture = document.getElementById('simMoisture');
    const simRain = document.getElementById('simRain');
    const simTemp = document.getElementById('simTemp');
    
    const valMoisture = document.getElementById('valMoisture');
    const valRain = document.getElementById('valRain');
    const valTemp = document.getElementById('valTemp');
    
    const btnRunSim = document.getElementById('btnRunSim');
    
    const simPlaceholder = document.getElementById('simPlaceholder');
    const simLoading = document.getElementById('simLoading');
    const simData = document.getElementById('simData');

    const resYield = document.getElementById('resYield');
    const resRisk = document.getElementById('resRisk');
    const resRevenue = document.getElementById('resRevenue');
    const resRevenueTotal = document.getElementById('resRevenueTotal');
    const resRecommendation = document.getElementById('resRecommendation');

    const barYield = document.getElementById('barYield');
    const barRisk = document.getElementById('barRisk');

    // Sync input sliders with values display
    if (simMoisture && valMoisture) {
        simMoisture.addEventListener('input', () => { valMoisture.textContent = `${simMoisture.value}%`; });
    }
    if (simRain && valRain) {
        simRain.addEventListener('input', () => { valRain.textContent = `${simRain.value}mm`; });
    }
    if (simTemp && valTemp) {
        simTemp.addEventListener('input', () => { valTemp.textContent = `${simTemp.value}°C`; });
    }

    if (btnRunSim) {
        btnRunSim.addEventListener('click', () => {
            // Change button state to disabled with loading icon
            btnRunSim.disabled = true;
            const originalBtnHtml = btnRunSim.innerHTML;
            btnRunSim.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Simulation...';

            // Swap displays to loading state
            simPlaceholder.classList.add('hidden');
            simData.classList.add('hidden');
            simLoading.classList.remove('hidden');

            setTimeout(() => {
                // Get values
                const crop = simCrop.value;
                const moisture = parseInt(simMoisture.value);
                const rain = parseInt(simRain.value);
                const temp = parseInt(simTemp.value);

                // Simulation Model logic
                let yieldBase = 0;
                let pricePerTon = 0;
                let cropNameDisplay = '';
                
                switch(crop) {
                    case 'wheat':
                        yieldBase = 5.2; pricePerTon = 300; cropNameDisplay = 'Spring Wheat'; break;
                    case 'maize':
                        yieldBase = 8.5; pricePerTon = 180; cropNameDisplay = 'Maize (Corn)'; break;
                    case 'soybeans':
                        yieldBase = 3.4; pricePerTon = 450; cropNameDisplay = 'Soybeans'; break;
                    case 'barley':
                        yieldBase = 4.8; pricePerTon = 240; cropNameDisplay = 'Winter Barley'; break;
                }

                // Moisture multiplier (optimal between 35% and 55%)
                let moistMult = 1.0;
                if (moisture < 30) {
                    moistMult = 0.5 + (moisture / 60); // Drought stress
                } else if (moisture > 60) {
                    moistMult = 1.2 - (moisture / 300); // Over-saturation rotting risk
                }

                // Temperature multiplier (optimal between 18°C and 28°C)
                let tempMult = 1.0;
                if (temp < 15) {
                    tempMult = 0.6 + (temp / 50); // Low thermal units
                } else if (temp > 32) {
                    tempMult = 1.4 - (temp / 80); // High heat stress
                }

                // Rain helper
                let rainMult = 1.0;
                if (rain < 15) rainMult = 0.9;
                else if (rain > 90) rainMult = 0.85; // Flood risk

                // Calculate Yield
                const predictedYield = Math.max(0.5, (yieldBase * moistMult * tempMult * rainMult)).toFixed(2);
                const maxYield = yieldBase * 1.2;
                const yieldPercent = Math.min(100, (predictedYield / maxYield) * 100);

                // Calculate Risk
                let riskPercent = 10;
                let riskText = 'Low';
                let recommendation = '';

                if (moisture < 25) {
                    riskPercent += 40;
                    recommendation += 'Severe water stress detected. Trigger main irrigation nodes A & B. ';
                } else if (moisture > 70) {
                    riskPercent += 30;
                    recommendation += 'Excess saturation warning: high crop root rot risk. Cease irrigation. ';
                }

                if (temp > 35) {
                    riskPercent += 30;
                    recommendation += 'Ambient heatwave threshold reached. Spray protective foliage coating. ';
                } else if (temp < 8) {
                    riskPercent += 40;
                    recommendation += 'Frost watch active: activate heat heaters/wind blowers. ';
                }

                if (rain > 110) {
                    riskPercent += 20;
                    recommendation += 'Heavy downpour expected. Clear drainage channel paths. ';
                }

                if (riskPercent >= 60) riskText = 'High';
                else if (riskPercent >= 30) riskText = 'Medium';
                else recommendation = 'Conditions nominal. Yield model predicts excellent biomass density. Proceed with planned schedules.';

                // Calculate revenue values
                const totalHectares = 10;
                const revenuePerHa = Math.round(predictedYield * pricePerTon);
                const totalRevenue = revenuePerHa * totalHectares;

                // Update text fields
                resYield.textContent = `${predictedYield} Tons/Ha`;
                resRisk.textContent = `${riskText} (${riskPercent}%)`;
                resRevenue.textContent = `$${revenuePerHa.toLocaleString()} / Ha`;
                resRevenueTotal.textContent = `Total: $${totalRevenue.toLocaleString()} (${totalHectares} Ha acreage)`;
                resRecommendation.textContent = recommendation;

                // Update bar graphs
                barYield.style.width = `${yieldPercent}%`;
                barRisk.style.width = `${riskPercent}%`;

                // Set colors for risk bar
                if (riskPercent >= 60) {
                    barRisk.style.background = 'var(--red)';
                } else if (riskPercent >= 30) {
                    barRisk.style.background = 'var(--yellow)';
                } else {
                    barRisk.style.background = 'var(--primary)';
                }

                // Hide loading, show results
                simLoading.classList.add('hidden');
                simData.classList.remove('hidden');

                // Restore button
                btnRunSim.disabled = false;
                btnRunSim.innerHTML = originalBtnHtml;

            }, 2000);
        });
    }


    // --- 7. Live Operations Dashboard (Chart.js Integration) ---
    
    // Config Chart 1: Moisture Line Chart (updates live)
    const ctxMoisture = document.getElementById('chartMoisture');
    let moistureChart = null;
    let moistureData = [38, 38.2, 38.5, 38.3, 38.1, 38.4];
    let moistureLabels = ['18:49:50', '18:49:51', '18:49:52', '18:49:53', '18:49:54', '18:49:55'];

    if (ctxMoisture) {
        moistureChart = new Chart(ctxMoisture, {
            type: 'line',
            data: {
                labels: moistureLabels,
                datasets: [{
                    label: 'Moisture (%)',
                    data: moistureData,
                    borderColor: '#00a2ff',
                    backgroundColor: 'rgba(0, 162, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                    y: { min: 20, max: 60, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8' } }
                }
            }
        });

        // Interval to simulate live data feed updates (Every 2 seconds)
        setInterval(() => {
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            
            // Generate a random swing in moisture values
            const lastVal = moistureData[moistureData.length - 1];
            const change = (Math.random() - 0.5) * 0.8;
            const newVal = parseFloat(Math.min(55, Math.max(25, lastVal + change)).toFixed(1));

            moistureLabels.push(timeStr);
            moistureData.push(newVal);

            // Cap queue size at 8
            if (moistureLabels.length > 8) {
                moistureLabels.shift();
                moistureData.shift();
            }

            moistureChart.update();
        }, 2000);
    }

    // Config Chart 2: Microclimate Analysis (Dual Bar chart)
    const ctxClimate = document.getElementById('chartMicroclimate');
    if (ctxClimate) {
        new Chart(ctxClimate, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Temp (°C)',
                        data: [27, 28, 29, 28.5, 26, 27.5, 28.5],
                        backgroundColor: 'rgba(255, 123, 0, 0.65)',
                        borderColor: '#ff7b00',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Humidity (%)',
                        data: [65, 62, 60, 62, 68, 64, 62],
                        backgroundColor: 'rgba(0, 240, 255, 0.45)',
                        borderColor: '#00f0ff',
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    // Config Chart 3: Market Price Trends (Line chart)
    const ctxMarket = document.getElementById('chartMarket');
    if (ctxMarket) {
        new Chart(ctxMarket, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Wheat Index',
                        data: [290, 295, 310, 305, 300, 312],
                        borderColor: '#ffd000',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Maize Index',
                        data: [175, 172, 180, 185, 182, 190],
                        borderColor: '#1abc9c',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    // Config Chart 4: NDVI Spread Distribution (Doughnut chart)
    const ctxHealth = document.getElementById('chartHealth');
    if (ctxHealth) {
        new Chart(ctxHealth, {
            type: 'doughnut',
            data: {
                labels: ['Optimal NDVI', 'Nitrogen Demand', 'Moisture Stress Alert'],
                datasets: [{
                    data: [65, 20, 15],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.75)',
                        'rgba(255, 208, 0, 0.75)',
                        'rgba(255, 59, 59, 0.75)'
                    ],
                    borderColor: '#0f172a',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', padding: 10 }
                    }
                }
            }
        });
    }


    // --- 8. Economic Benefits Stats Counter Animation ---
    const counterElements = document.querySelectorAll('.counter');
    const benefitsSection = document.querySelector('.section-benefits');
    let animatedCounters = false;

    function startCounters() {
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const speed = target / 50; // Dynamic speed increment
            
            const updateCount = () => {
                count += speed;
                if (count < target) {
                    counter.textContent = Math.floor(count);
                    setTimeout(updateCount, 30);
                } else {
                    counter.textContent = target;
                }
            };
            updateCount();
        });
    }

    // IntersectionObserver to trigger counter when section scrolls into viewport
    if (benefitsSection && counterElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedCounters) {
                    startCounters();
                    animatedCounters = true;
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(benefitsSection);
    }


    // --- 9. Contact Form & Demo Booking Modal ---
    const contactForm = document.getElementById('contactForm');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const btnModalClose = document.getElementById('btnModalClose');

    const modalFarmText = document.getElementById('modalFarmText');
    const modalCropText = document.getElementById('modalCropText');
    const modalEmailText = document.getElementById('modalEmailText');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input entries
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const farmSize = document.getElementById('contactFarmSize').value;
            const cropType = document.getElementById('contactCrop').options[document.getElementById('contactCrop').selectedIndex].text;

            // Populate Modal Text fields
            modalFarmText.textContent = farmSize;
            modalCropText.textContent = cropType;
            modalEmailText.textContent = email;

            // Trigger Modal visibility
            modalBackdrop.classList.remove('hidden');

            // Reset form
            contactForm.reset();
        });
    }

    if (btnModalClose && modalBackdrop) {
        btnModalClose.addEventListener('click', () => {
            modalBackdrop.classList.add('hidden');
        });
    }

    // --- 10. Live Location & Weather Fetching ---
    let liveMap = null;
    let mapMarker = null;

    const initMap = (lat, lon) => {
        const mapElement = document.getElementById('interactiveMap');
        if (!mapElement) return;

        if (!liveMap) {
            // Initialize Leaflet Map
            liveMap = L.map('interactiveMap').setView([lat, lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(liveMap);
            
            mapMarker = L.marker([lat, lon]).addTo(liveMap)
                .bindPopup('Selected Location')
                .openPopup();

            // Map click event
            liveMap.on('click', function(e) {
                const clickedLat = e.latlng.lat;
                const clickedLon = e.latlng.lng;
                
                mapMarker.setLatLng([clickedLat, clickedLon]);
                liveMap.setView([clickedLat, clickedLon]);
                
                fetchLiveWeather(clickedLat, clickedLon);
            });
        } else {
            liveMap.setView([lat, lon]);
            mapMarker.setLatLng([lat, lon]);
        }
    };

    const fetchLiveWeather = async (lat = 36.6777, lon = -121.6555) => {
        const weatherStatus = document.getElementById('weatherStatus');
        const liveTemp = document.getElementById('liveTemp');
        const liveHumidity = document.getElementById('liveHumidity');
        const liveWind = document.getElementById('liveWind');
        const liveWeatherDesc = document.getElementById('liveWeatherDesc');
        const liveWeatherIcon = document.getElementById('liveWeatherIcon');
        
        // Hero card elements
        const heroMoisture = document.getElementById('heroMoisture');
        const heroUV = document.getElementById('heroUV');
        const heroTemp = document.getElementById('heroTemp');
        const heroWind = document.getElementById('heroWind');

        if(!weatherStatus) return;

        try {
            weatherStatus.innerHTML = '<i class="fa-solid fa-satellite-dish fa-spin-pulse"></i> Syncing...';
            
            // Open-Meteo API (No Key Required) with extra params for UV and Soil
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,uv_index,soil_moisture_0_to_7cm`);
            const data = await response.json();
            
            const current = data.current;
            
            // Update Dashboard
            if(liveTemp) liveTemp.textContent = current.temperature_2m;
            if(liveHumidity) liveHumidity.textContent = current.relative_humidity_2m + '%';
            if(liveWind) liveWind.textContent = current.wind_speed_10m + ' km/h';
            
            const livePressure = document.getElementById('livePressure');
            if (livePressure && current.surface_pressure) {
                livePressure.textContent = current.surface_pressure + ' hPa';
            }

            // Update Hero Card
            if(heroMoisture && current.soil_moisture_0_to_7cm !== undefined) {
                heroMoisture.textContent = (current.soil_moisture_0_to_7cm * 100).toFixed(1) + '%';
            }
            if(heroUV && current.uv_index !== undefined) heroUV.textContent = current.uv_index.toFixed(1) + ' UV';
            if(heroTemp) heroTemp.textContent = current.temperature_2m + '°C';
            if(heroWind) heroWind.textContent = current.wind_speed_10m + ' km/h';

            // Simulate Water Quality Index (WQI) based on coordinates
            const liveWater = document.getElementById('liveWater');
            if (liveWater) {
                // Generates a consistent pseudo-random WQI between 65 and 95
                const wqi = (Math.abs(Math.sin(lat * lon)) * 30 + 65).toFixed(1);
                liveWater.textContent = wqi + ' WQI';
            }

            // Update Map
            initMap(lat, lon);

            // Basic WMO Weather Code to string mapping
            const code = current.weather_code;
            let desc = 'Clear';
            let iconClass = 'fa-sun';
            
            if (code === 0) { desc = 'Clear Sky'; iconClass = 'fa-sun'; }
            else if (code >= 1 && code <= 3) { desc = 'Partly Cloudy'; iconClass = 'fa-cloud-sun'; }
            else if (code >= 45 && code <= 48) { desc = 'Fog'; iconClass = 'fa-smog'; }
            else if (code >= 51 && code <= 67) { desc = 'Rain'; iconClass = 'fa-cloud-rain'; }
            else if (code >= 71 && code <= 77) { desc = 'Snow'; iconClass = 'fa-snowflake'; }
            else if (code >= 80 && code <= 82) { desc = 'Showers'; iconClass = 'fa-cloud-showers-heavy'; }
            else if (code >= 95) { desc = 'Thunderstorm'; iconClass = 'fa-cloud-bolt'; }

            if(liveWeatherDesc) liveWeatherDesc.textContent = desc;
            if(liveWeatherIcon) liveWeatherIcon.className = `fa-solid ${iconClass}`;
            
            weatherStatus.innerHTML = '<i class="fa-solid fa-check"></i> Live';
            weatherStatus.classList.replace('badge-cyan', 'badge-green');
            
        } catch (error) {
            console.error("Error fetching live weather:", error);
            weatherStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error';
            weatherStatus.classList.replace('badge-cyan', 'badge-red');
        }
    };

    // Geolocation trigger
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchLiveWeather(position.coords.latitude, position.coords.longitude);
                setInterval(() => fetchLiveWeather(position.coords.latitude, position.coords.longitude), 15 * 60 * 1000);
            },
            (error) => {
                console.warn("Geolocation blocked or failed. Using default coordinates.", error);
                fetchLiveWeather();
                setInterval(fetchLiveWeather, 15 * 60 * 1000);
            }
        );
    } else {
        fetchLiveWeather();
        setInterval(fetchLiveWeather, 15 * 60 * 1000);
    }

});
