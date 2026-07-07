document.getElementById('roll-btn').addEventListener('click', function() {
    // 1. Captura de datos básicos e interfaz
    const razaAtq = document.getElementById('raza-atq').value;
    const armaSeleccionada = document.getElementById('arma').value;
    let boBase = parseInt(document.getElementById('bo').value) || 0;
    
    const razaDef = document.getElementById('raza-def').value;
    const ta = parseInt(document.getElementById('ta').value) || 1;
    let bdBase = parseInt(document.getElementById('bd').value) || 0;
    
    // Captura de Casillas / Modificadores Situacionales
    const modFlanco = document.getElementById('mod-flanco').checked;
    const modEspalda = document.getElementById('mod-espalda').checked;
    const modAtqAturdido = document.getElementById('mod-atq-aturdido').checked;
    const modAtqHerido = document.getElementById('mod-atq-herido').checked;
    
    const modDefAturdido = document.getElementById('mod-def-aturdido').checked;
    const modDefSorprendido = document.getElementById('mod-def-sorprendido').checked;

    const diceContainer = document.getElementById('dice-container');
    const resultBox = document.getElementById('result-box');
    
    diceContainer.innerText = "...";
    diceContainer.style.display = 'block';
    diceContainer.classList.add('spinning');
    resultBox.style.display = 'none';
    
    setTimeout(() => {
        diceContainer.classList.remove('spinning');
        
        // --- REGLA DADOS MERP (TIRADAS ABIERTAS) ---
        let dadoOriginal = Math.floor(Math.random() * 100) + 1;
        let totalDados = dadoOriginal;
        let logTiradas = [dadoOriginal];
        
        while (dadoOriginal >= 96) {
            dadoOriginal = Math.floor(Math.random() * 100) + 1;
            totalDados += dadoOriginal;
            logTiradas.push(dadoOriginal);
        }
        diceContainer.innerText = totalDados;

        // --- CLASIFICACIÓN DEL TIPO DE ARMA ---
        let tipoCategoriaTabla = 'filo'; // Por defecto
        if (["maza", "martillo"].includes(armaSeleccionada)) tipoCategoriaTabla = 'contundente';
        if (["gran_hacha", "mandoble"].includes(armaSeleccionada)) tipoCategoriaTabla = 'dos_manos';
        if (["arco_largo", "arco_corto", "honda"].includes(armaSeleccionada)) tipoCategoriaTabla = 'proyectil';

        // --- CÁLCULO DE MODIFICADORES DEL JUEGO ---
        let modBO = 0;
        let desgloseTextoBO = [];
        let modBD = 0;
        let desgloseTextoBD = [];
        let mitigacionEnano = 0;

        // Modificadores Raciales de la Ficha (Atacante)
        if (razaAtq === 'elfo' && ['espada_ancha', 'espada_corta', 'arco_largo', 'arco_corto'].includes(armaSeleccionada)) {
            modBO += 10; desgloseTextoBO.push("+10 Orgullo Elfo con su arma predilecta");
        } else if (razaAtq === 'enano' && armaSeleccionada === 'gran_hacha') {
            modBO += 10; desgloseTextoBO.push("+10 Maestría Enana con Gran Hacha");
        } else if (razaAtq === 'orco' && ['espada_ancha', 'cimitarra', 'maza', 'gran_hacha'].includes(armaSeleccionada)) {
            modBO += 5; desgloseTextoBO.push("+5 Crueldad OrquOperation");
        } else if (razaAtq === 'orco' && tipoCategoriaTabla === 'proyectil') {
            modBO -= 10; desgloseTextoBO.push("-10 Desgana de orco con proyectiles");
        } else if (razaAtq === 'hobbit' && armaSeleccionada === 'honda') {
            modBO += 15; desgloseTextoBO.push("+15 Puntería Hobbit con Honda");
        } else if (razaAtq === 'humano') {
            modBO += 5; desgloseTextoBO.push("+5 Versatilidad Dúnadan");
        }

        // 🌟 REGLA DE RESTRICCIÓN DE TAMAÑO (REGLAS DE MERP)
        if (razaAtq === 'hobbit' && tipoCategoriaTabla === 'dos_manos') {
            modBO -= 30; desgloseTextoBO.push("<span style='color:#ff4d4d;'>-30 Penalización de Tamaño (Un mediano no puede equilibrar armas a dos manos)</span>");
        }

        // Modificadores Situacionales (Atacante checkboxes)
        if (modFlanco) { modBO += 15; desgloseTextoBO.push("+15 Ventaja de Flanco"); }
        if (modEspalda) { modBO += 35; desgloseTextoBO.push("+35 Ataque por la Espalda"); }
        if (modAtqAturdido) { modBO -= 20; desgloseTextoBO.push("-20 Estado: Aturdido"); }
        if (modAtqHerido) { modBO -= 10; desgloseTextoBO.push("-10 Estado: Herido Grave"); }

        // Modificadores de la Ficha y Situación (Defensor)
        if (razaDef === 'hobbit') { modBD += 15; desgloseTextoBD.push("+15 Tamaño menudo (Dificulta ser alcanzado)"); }
        if (razaDef === 'elfo') { modBD += 5; desgloseTextoBD.push("+5 Gracia y reflejos"); }
        if (razaDef === 'enano') { mitigacionEnano = 2; } // Absorción física innata

        if (modDefAturdido) {
            // Regla MERP: Un defensor aturdido pierde su bonificación por escudo y agilidad en la BD.
            modBD -= bdBase; 
            desgloseTextoBD.push(`-${bdBase} Defensor Aturdido (Pierde toda la BD Base de esquiva/escudo)`);
        }
        if (modDefSorprendido) { modBD -= 20; desgloseTextoBD.push("-20 Defensor Sorprendido"); }

        // Totales finales aplicados a las tablas
        let boFinal = boBase + modBO;
        let bdFinal = bdBase + modBD;
        let resultadoTabla = totalDados + boFinal - bdFinal;

        // --- PROCESADO DE DAÑO POR TABLAS ---
        let respuestaCombate = "";
        
        if (logTiradas[0] <= 4) { // Pifia automática
            respuestaCombate = `
                <div style="color: #ff4d4d; font-size: 22px; font-weight: bold; margin-bottom: 10px;">💥 ¡¡PIFIA DE COMBATE!! 💥</div>
                <p>El primer dado fue un <strong>${logTiradas[0]} natural</strong>. El arma rebota, se traba o el atacante pierde el equilibrio. ¡Queda <strong>Aturdido durante 1 asalto</strong> y sufre -20 BO en su próximo turno!</p>
            `;
        } else {
            let pvDaño = 0;
            let rangoCritico = "Ninguno";
            let descCritico = "";

            // LÓGICA DE TABLA SEGÚN LA CATEGORÍA DEL ARMA ELEGIDA
            if (tipoCategoriaTabla === 'filo') {
                if (resultadoTabla <= 40) pvDaño = 0;
                else if (resultadoTabla <= 65) pvDaño = (ta <= 4) ? 5 : (ta <= 8) ? 3 : (ta <= 12) ? 1 : 0;
                else if (resultadoTabla <= 85) pvDaño = (ta <= 4) ? 10 : (ta <= 8) ? 7 : (ta <= 12) ? 4 : 0;
                else if (resultadoTabla <= 100) pvDaño = (ta <= 4) ? 15 : (ta <= 8) ? 12 : (ta <= 12) ? 9 : 3;
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 18 : (ta <= 8) ? 15 : 11; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = (ta <= 4) ? 22 : (ta <= 12) ? 16 : 8; rangoCritico = (ta <= 12) ? "B" : "A"; }
                else { pvDaño = (ta <= 4) ? 30 : 20; rangoCritico = (ta <= 4) ? "D" : (ta <= 12) ? "C" : "B"; }
            }
            else if (tipoCategoriaTabla === 'contundente') {
                if (resultadoTabla <= 40) pvDaño = 0;
                else if (resultadoTabla <= 65) pvDaño = (ta <= 4) ? 4 : (ta >= 13) ? 5 : 2; // Mejor contra mallas
                else if (resultadoTabla <= 85) pvDaño = (ta <= 4) ? 9 : (ta >= 13) ? 10 : 6;
                else if (resultadoTabla <= 100) pvDaño = (ta <= 4) ? 14 : (ta >= 13) ? 15 : 10;
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 19 : 16; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = 22; rangoCritico = (ta >= 13) ? "B" : "A"; }
                else { pvDaño = 28; rangoCritico = (ta >= 13) ? "D" : "C"; }
            }
            else if (tipoCategoriaTabla === 'dos_manos') {
                // Las armas a dos manos tienen umbrales letales más altos
                if (resultadoTabla <= 35) pvDaño = 0;
                else if (resultadoTabla <= 65) pvDaño = (ta <= 4) ? 8 : (ta <= 12) ? 6 : 4;
                else if (resultadoTabla <= 85) pvDaño = (ta <= 4) ? 15 : (ta <= 12) ? 12 : 9;
                else if (resultadoTabla <= 100) { pvDaño = (ta <= 4) ? 22 : 16; rangoCritico = "A"; }
                else if (resultadoTabla <= 115) { pvDaño = 26; rangoCritico = "B"; }
                else if (resultadoTabla <= 130) { pvDaño = 32; rangoCritico = "C"; }
                else { pvDaño = 42; rangoCritico = (ta <= 4) ? "E" : "D"; }
            }
            else if (tipoCategoriaTabla === 'proyectil') {
                if (resultadoTabla <= 45) pvDaño = 0;
                else if (resultadoTabla <= 65) pvDaño = (ta <= 4) ? 8 : (ta <= 12) ? 3 : 0;
                else if (resultadoTabla <= 85) pvDaño = (ta <= 4) ? 14 : (ta <= 12) ? 7 : 1;
                else if (resultadoTabla <= 100) pvDaño = (ta <= 4) ? 20 : (ta <= 12) ? 11 : 4;
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 25 : 15; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = 29; rangoCritico = (ta <= 4) ? "C" : "B"; }
                else { pvDaño = 36; rangoCritico = (ta <= 4) ? "E" : "C"; }
            }

            // Aplicar robustez pasiva enana
            if (razaDef === 'enano' && pvDaño > 0) {
                pvDaño = Math.max(1, pvDaño - mitigacionEnano);
                descCritico += `<br><small style="color:#4da6ff;">🛡️ Robustez Enana: Absorbe ${mitigacionEnano} PV del golpe.</small>`;
            }

            // Generación de textos descriptivos de críticos dinámicos por tipo
            if (rangoCritico !== "Ninguno") {
                if (tipoCategoriaTabla === 'filo' || tipoCategoriaTabla === 'dos_manos') {
                    const criticosCorte = {
                        "A": "⚔️ <strong>Crítico de Filo (Rango A):</strong> Un tajo limpio. +3 PV extra y -5 a la siguiente acción por dolor.",
                        "B": "🩸 <strong>Crítico de Filo (Rango B):</strong> Herida profunda sangrante. +5 PV extra y el rival sangra 1 PV/asalto.",
                        "C": "🦴 <strong>Crítico de Filo (Rango C):</strong> El filo quiebra una costilla. +8 PV extra y el rival queda **Aturdido 1 asalto**.",
                        "D": "💀 <strong>Crítico de Filo (Rango D):</strong> Tajo demoledor. +12 PV extra, enemigo **Aturdido 2 asaltos** y sangra 2 PV/asalto.",
                        "E": "🦅 <strong>Crítico de Filo (Rango E):</strong> ¡Corte arterial letal! +20 PV extra, derribado y **Aturdido durante 3 asaltos**."
                    };
                    descCritico = criticosCorte[rangoCritico] + descCritico;
                } else if (tipoCategoriaTabla === 'contundente') {
                    const criticosPorra = {
                        "A": "💥 <strong>Crítico de Aplastamiento (Rango A):</strong> Contusión fuerte en articulación. +2 PV extra y -5 a la acción.",
                        "B": "🦴 <strong>Crítico de Aplastamiento (Rango B):</strong> Impacto violento. +5 PV extra y el defensor queda **Aturdido 1 asalto**.",
                        "C": "🧠 <strong>Crítico de Aplastamiento (Rango C):</strong> Conmoción craneal sorda. +8 PV extra y enemigo **Aturdido 2 asaltos**.",
                        "D": "🦵 <strong>Crítico de Aplastamiento (Rango D):</strong> Rompe hueso largo de soporte. +12 PV extra, derribado y **Aturdido 3 asaltos**.",
                        "E": "💀 <strong>Crítico de Aplastamiento (Rango E):</strong> Estallido del hueso. +20 PV extra y el rival queda **Incapacitado/Aturdido 4 asaltos**."
                    };
                    descCritico = criticosPorra[rangoCritico] + descCritico;
                } else if (tipoCategoriaTabla === 'proyectil') {
                    const criticosFlechazo = {
                        "A": "🎯 <strong>Crítico de Perforación (Rango A):</strong> Flecha clavada superficial. +3 PV extra y -5 de penalizador.",
                        "B": "🩸 <strong>Crítico de Perforación (Rango B):</strong> Traspasa tejido blando. +5 PV extra y hemorragia de 1 PV/asalto.",
                        "C": "🏹 <strong>Crítico de Perforación (Rango C):</strong> Impacto severo en torso. +8 PV extra, sangra 2 PV/asalto y queda **Aturdido 1 asalto**.",
                        "D": "👁️ <strong>Crítico de Perforación (Rango D):</strong> Perforación orgánica grave. +12 PV extra y enemigo **Aturdido 2 asaltos**.",
                        "E": "💀 <strong>Crítico de Perforación (Rango E):</strong> Atraviesa un órgano vital. +22 PV extra, cae inconsciente y **Aturdido 4 asaltos**."
                    };
                    descCritico = criticosFlechazo[rangoCritico] + descCritico;
                }
            } else {
                descCritico = "⚔️ Golpe directo que no logra superar la armadura lo suficiente para causar heridas críticas.";
            }

            respuestaCombate = `
                <div style="font-size: 28px; color: #ffcc00; font-weight: bold; margin-bottom: 15px;">
                    💥 Impacto: ${pvDaño} PV 💥
                </div>
                <div style="background-color: #252525; padding: 12px; border-radius: 6px; border-left: 4px solid #b71c1c; text-align: left; font-size: 15px;">
                    ${descCritico}
                </div>
            `;
        }
        
        // Conversión estética de identificadores a nombres del manual
        const nombresArmas = {
            espada_ancha: "Espada Ancha", espada_corta: "Espada Corta", daga: "Daga / Puñal", cimitarra: "Cimitarra",
            maza: "Maza", martillo: "Martillo de Guerra", gran_hacha: "Gran Hacha", mandoble: "Mandoble",
            arco_largo: "Arco Largo", arco_corto: "Arco Corto", honda: "Honda"
        };
        const nombresRazas = { humano: "Humano", elfo: "Elfo", enano: "Enano", orco: "Orco", hobbit: "Hobbit" };
        const textoLog = logTiradas.length > 1 ? ` <span style="color:#ffcc00;">(Tirada Abierta: ${logTiradas.join(' + ')})</span>` : '';

        // Renderizado del resultado final
        resultBox.innerHTML = `
            <h3 style="color:#ffcc00; border-bottom: 1px solid #8b7355; padding-bottom: 8px; margin-top: 0;">⚔️ Registro de Combate MERP ⚔️</h3>
            
            <p style="font-size: 16px; margin: 8px 0;"><strong>Ataque:</strong> ${nombresRazas[razaAtq]} con <strong>${nombresArmas[armaSeleccionada]}</strong></p>
            <p style="font-size: 16px; margin: 8px 0;"><strong>Defensa:</strong> ${nombresRazas[razaDef]} equipado con <strong>TA-${ta}</strong></p>
            
            <div style="background-color:#111; padding: 8px; font-size:13px; text-align:left; border-radius:4px; margin: 10px 0; border: 1px solid #333;">
                <span style="color:#ff4d4d;"><strong>Modificadores BO:</strong></span> ${desgloseTextoBO.length > 0 ? desgloseTextoBO.join(' | ') : 'Ninguno'}<br>
                <span style="color:#3399ff;"><strong>Modificadores BD:</strong></span> ${desgloseTextoBD.length > 0 ? desgloseTextoBD.join(' | ') : 'Ninguno'}
            </div>

            <p style="font-size: 14px; color: #aaa; margin: 4px 0;">
                <strong>Fórmula final:</strong> ${totalDados} (Dados) + ${boFinal} (BO) - ${bdFinal} (BD)
            </p>
            <p style="font-size: 20px; margin: 10px 0; color:#ffcc00;">Total en Tabla de Combate: <strong>${resultadoTabla}</strong></p>
            <hr style="border-color: #444; margin: 15px 0;">
            ${respuestaCombate}
        `;
        resultBox.style.display = 'block';
        
    }, 1000);
});
