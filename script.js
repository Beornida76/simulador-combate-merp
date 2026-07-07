document.getElementById('roll-btn').addEventListener('click', function() {
    // Captura inicial de datos
    const razaAtq = document.getElementById('raza-atq').value;
    const armaSeleccionada = document.getElementById('arma').value;
    let boBase = parseInt(document.getElementById('bo').value) || 0;
    let pvAtqInicial = parseInt(document.getElementById('pv-atq').value) || 1;
    
    const razaDef = document.getElementById('raza-def').value;
    const ta = parseInt(document.getElementById('ta').value) || 1;
    let bdBase = parseInt(document.getElementById('bd').value) || 0;
    let pvDefInicial = parseInt(document.getElementById('pv-def').value) || 1;
    
    const llevaEscudo = document.getElementById('def-escudo').checked;
    let puntosParar = parseInt(document.getElementById('def-parar').value) || 0;
    
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
        
        // --- 🎲 SISTEMA DE DADOS MERP ---
        let dadoOriginal = Math.floor(Math.random() * 100) + 1;
        let totalDados = dadoOriginal;
        let logTiradas = [dadoOriginal];
        let tipoDeTiradaTexto = "";

        if (dadoOriginal >= 96) {
            tipoDeTiradaTexto = ` <span style="color:#00ff66;">(¡Tirada Abierta Arriba!)</span>`;
            while (dadoOriginal >= 96) {
                dadoOriginal = Math.floor(Math.random() * 100) + 1;
                totalDados += dadoOriginal;
                logTiradas.push(dadoOriginal);
            }
        } else if (dadoOriginal <= 5) {
            tipoDeTiradaTexto = ` <span style="color:#ff3333;">(¡Tirada Abierta Abajo!)</span>`;
            let dadoResta = Math.floor(Math.random() * 100) + 1;
            totalDados -= dadoResta;
            logTiradas.push(-dadoResta);
            while (dadoResta >= 96) {
                dadoResta = Math.floor(Math.random() * 100) + 1;
                totalDados -= dadoResta;
                logTiradas.push(-dadoResta);
            }
        }
        diceContainer.innerText = totalDados;

        let tipoCategoriaTabla = 'filo';
        if (["maza", "martillo"].includes(armaSeleccionada)) tipoCategoriaTabla = 'contundente';
        if (["gran_hacha", "mandoble"].includes(armaSeleccionada)) tipoCategoriaTabla = 'dos_manos';
        if (["arco_largo", "arco_corto", "honda"].includes(armaSeleccionada)) tipoCategoriaTabla = 'proyectil';

        // Modificadores de combate
        let modBO = 0; let desgloseTextoBO = [];
        let modBD = 0; let desgloseTextoBD = [];
        let mitigacionDañoracial = 0;

        // Raciales Atacante
        if (razaAtq === 'elfo' && ['espada_ancha', 'espada_corta', 'arco_largo', 'arco_corto'].includes(armaSeleccionada)) { modBO += 10; desgloseTextoBO.push("+10 Racial Alto Elfo"); }
        else if (razaAtq === 'elfo_silvano' && ['arco_largo', 'arco_corto'].includes(armaSeleccionada)) { modBO += 15; desgloseTextoBO.push("+15 Puntería Silvana"); }
        else if (razaAtq === 'rohirrim' && ['espada_ancha', 'espada_corta'].includes(armaSeleccionada)) { modBO += 10; desgloseTextoBO.push("+10 Acero de Rohan"); }
        else if (razaAtq === 'enano' && armaSeleccionada === 'gran_hacha') { modBO += 10; desgloseTextoBO.push("+10 Orgullo Enano"); }
        else if (razaAtq === 'orco' && ['espada_ancha', 'cimitarra', 'maza', 'gran_hacha'].includes(armaSeleccionada)) { modBO += 5; desgloseTextoBO.push("+5 Furia Uruk-hai"); }
        else if (razaAtq === 'orco_comun') { modBO -= 5; desgloseTextoBO.push("-5 Debilidad Snaga"); if (modFlanco || modEspalda) { modBO += 10; desgloseTextoBO.push("+10 Emboscada Rastrera"); } }
        else if (razaAtq === 'trol') { if (tipoCategoriaTabla === 'dos_manos') { modBO += 20; desgloseTextoBO.push("+20 Fuerza de Trol"); } if (tipoCategoriaTabla === 'proyectil') { modBO -= 50; desgloseTextoBO.push("-50 Torpeza Proyectil"); } }
        else if (razaAtq === 'hobbit' && armaSeleccionada === 'honda') { modBO += 15; desgloseTextoBO.push("+15 Puntería Mediano"); }

        if (razaAtq === 'hobbit' && tipoCategoriaTabla === 'dos_manos') { modBO -= 30; desgloseTextoBO.push("-30 Restricción Física"); }

        if (modFlanco) { modBO += 15; desgloseTextoBO.push("+15 Flanco"); }
        if (modEspalda) { modBO += 35; desgloseTextoBO.push("+35 Espalda"); }
        if (modAtqAturdido) { modBO -= 20; desgloseTextoBO.push("-20 Aturdido"); }
        if (modAtqHerido) { modBO -= 10; desgloseTextoBO.push("-10 Herido"); }

        // Raciales Defensor
        if (razaDef === 'hobbit') { modBD += 15; desgloseTextoBD.push("+15 Blanco Pequeño"); }
        else if (razaDef === 'elfo') { modBD += 5; desgloseTextoBD.push("+5 Reflejos Noldor"); }
        else if (razaDef === 'elfo_silvano') { modBD += 10; desgloseTextoBD.push("+10 Agilidad Silvana"); }
        else if (razaDef === 'enano') { mitigacionDañoracial = 2; }
        else if (razaDef === 'trol') { modBD -= 15; desgloseTextoBD.push("-15 Blanco Gigante"); mitigacionDañoracial = 8; }

        if (llevaEscudo) {
            if (modEspalda || modDefAturdido) desgloseTextoBD.push("+0 Escudo (Anulado)");
            else { modBD += 20; desgloseTextoBD.push("+20 Escudo"); }
        }

        if (puntosParar > 0) {
            if (modDefAturdido || modDefSorprendido || modEspalda) desgloseTextoBD.push("+0 Parada (Imposible)");
            else { modBD += puntosParar; desgloseTextoBD.push(`+${puntosParar} Parada`); }
        }

        if (modDefAturdido) { modBD -= bdBase; desgloseTextoBD.push(`-${bdBase} BD Aturdimiento`); }
        if (modDefSorprendido) { modBD -= 20; desgloseTextoBD.push("-20 Sorprendido"); }

        let boFinal = boBase + modBO;
        let bdFinal = bdBase + modBD;
        let resultadoTabla = totalDados + boFinal - bdFinal;

        // Variables de control de estado dinámicas
        let dañoAplicadoDefensor = 0;
        let dañoAplicadoAtacante = 0;
        let estadoFinalAtacante = "Saludable";
        let estadoFinalDefensor = "Saludable";
        let respuestaCombate = "";
        
        let nuevoAturdidoDef = false;
        let nuevoAturdidoAtq = false;

        let esPifia = logTiradas[0] <= 4;

        if (esPifia) {
            let textoPifia = "";
            if (tipoCategoriaTabla === 'filo') {
                dañoAplicadoAtacante = 5; estadoFinalAtacante = "⚠️ HERIDO Y ATURDIDO"; nuevoAturdidoAtq = true;
                textoPifia = "💥 <strong>PIFIA DE FILO:</strong> Te cortas a ti mismo sufriendo <strong>5 PV directos</strong>, quedas <strong>Aturdido 1 asalto</strong> y el filo queda mellado (-5 al BO).";
            } else if (tipoCategoriaTabla === 'contundente') {
                estadoFinalAtacante = "⚠️ MUÑECA DISLOCADA (-15 BO)";
                textoPifia = "💥 <strong>PIFIA CONTUNDENTE:</strong> La inercia te deforma la muñeca. Arrastras un **-15 al BO durante los siguientes 3 asaltos**.";
            } else if (tipoCategoriaTabla === 'dos_manos') {
                estadoFinalAtacante = "⚠️ DERRIBADO Y ATURDIDO"; nuevoAturdidoAtq = true;
                textoPifia = "💥 <strong>PIFIA A DOS MANOS:</strong> ¡El peso te vence! Fallas el golpe y te vas al suelo. Quedas en **posición tendida (-30 BD)** y **Aturdido durante 2 asaltos**.";
            } else if (tipoCategoriaTabla === 'proyectil') {
                dañoAplicadoAtacante = 3; estadoFinalAtacante = "⚠️ HERIDO Y ATURDIDO"; nuevoAturdidoAtq = true;
                textoPifia = "💥 <strong>PIFIA DE PROYECTIL:</strong> ¡La cuerda se rompe! El latigazo te causa <strong>3 PV</strong> y quedas **Aturdido 2 asaltos**.";
            }
            estadoFinalDefensor = "Ileso";
            respuestaCombate = `
                <div style="color: #ff4d4d; font-size: 20px; font-weight: bold; margin-bottom: 10px;">❌ ¡FALLO CRÍTICO / PIFIA! ❌</div>
                <div style="background-color: #2b1111; padding: 14px; border-radius: 6px; border-left: 5px solid #ff4d4d; text-align: left; font-size: 15px; color:#ffb3b3;">
                    ${textoPifia}
                </div>
            `;
        } else {
            // --- TABLAS DE DAÑO NORMAL ---
            let pvDañoBase = 0;
            let rangoCritico = "Ninguno";
            let descCritico = "";
            let pvCriticoExtra = 0;
            let efectosEspecialesCritico = [];

            if (tipoCategoriaTabla === 'filo') {
                if (resultadoTabla <= 40) pvDañoBase = 0;
                else if (resultadoTabla <= 65) pvDañoBase = (ta <= 4) ? 5 : (ta <= 8) ? 3 : (ta <= 12) ? 1 : 0;
                else if (resultadoTabla <= 85) pvDañoBase = (ta <= 4) ? 10 : (ta <= 8) ? 7 : (ta <= 12) ? 4 : 0;
                else if (resultadoTabla <= 100) pvDañoBase = (ta <= 4) ? 15 : (ta <= 8) ? 12 : (ta <= 12) ? 9 : 3;
                else if (resultadoTabla <= 115) { pvDañoBase = (ta <= 4) ? 18 : (ta <= 8) ? 15 : 11; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDañoBase = (ta <= 4) ? 22 : (ta <= 12) ? 16 : 8; rangoCritico = (ta <= 12) ? "B" : "A"; }
                else { pvDañoBase = (ta <= 4) ? 30 : 20; rangoCritico = (ta <= 4) ? "D" : (ta <= 12) ? "C" : "B"; }
            }
            else if (tipoCategoriaTabla === 'contundente') {
                if (resultadoTabla <= 40) pvDañoBase = 0;
                else if (resultadoTabla <= 65) pvDañoBase = (ta <= 4) ? 4 : (ta >= 13) ? 5 : 2;
                else if (resultadoTabla <= 85) pvDañoBase = (ta <= 4) ? 9 : (ta >= 13) ? 10 : 6;
                else if (resultadoTabla <= 100) pvDañoBase = (ta <= 4) ? 14 : (ta >= 13) ? 15 : 10;
                else if (resultadoTabla <= 115) { pvDañoBase = (ta <= 4) ? 19 : 16; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDañoBase = 22; rangoCritico = (ta >= 13) ? "B" : "A"; }
                else { pvDañoBase = 28; rangoCritico = (ta >= 13) ? "D" : "C"; }
            }
            else if (tipoCategoriaTabla === 'dos_manos') {
                if (resultadoTabla <= 35) pvDañoBase = 0;
                else if (resultadoTabla <= 65) pvDañoBase = (ta <= 4) ? 8 : (ta <= 12) ? 6 : 4;
                else if (resultadoTabla <= 85) pvDañoBase = (ta <= 4) ? 15 : (ta <= 12) ? 12 : 9;
                else if (resultadoTabla <= 100) { pvDañoBase = (ta <= 4) ? 22 : 16; rangoCritico = "A"; }
                else if (resultadoTabla <= 115) { pvDañoBase = 26; rangoCritico = "B"; }
                else if (resultadoTabla <= 130) { pvDañoBase = 32; rangoCritico = "C"; }
                else { pvDañoBase = 42; rangoCritico = (ta <= 4) ? "E" : "D"; }
            }
            else if (tipoCategoriaTabla === 'proyectil') {
                if (resultadoTabla <= 45) pvDañoBase = 0;
                else if (resultadoTabla <= 65) pvDañoBase = (ta <= 4) ? 8 : (ta <= 12) ? 3 : 0;
                else if (resultadoTabla <= 85) pvDañoBase = (ta <= 4) ? 14 : (ta <= 12) ? 7 : 1;
                else if (resultadoTabla <= 100) pvDañoBase = (ta <= 4) ? 20 : (ta <= 12) ? 11 : 4;
                else if (resultadoTabla <= 115) { pvDañoBase = (ta <= 4) ? 25 : 15; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDañoBase = 29; rangoCritico = (ta <= 4) ? "C" : "B"; }
                else { pvDañoBase = 36; rangoCritico = (ta <= 4) ? "E" : "C"; }
            }

            // Mitigación por robustez
            if (mitigacionDañoracial > 0 && pvDañoBase > 0) {
                pvDañoBase = Math.max(1, pvDañoBase - mitigacionDañoracial);
                descCritico += `<br><small style="color:#4da6ff;">🛡️ Robustez: Absorbe ${mitigacionDañoracial} PV del golpe.</small>`;
            }

            // Desglose de críticos y activación de flags de estado
            if (rangoCritico !== "Ninguno") {
                if (tipoCategoriaTabla === 'filo' || tipoCategoriaTabla === 'dos_manos') {
                    const mapas = {
                        "A": { pv: 3, txt: "⚔️ <strong>Rango A:</strong> Tajo superficial. +3 PV.", aturdido: false },
                        "B": { pv: 5, txt: "🩸 <strong>Rango B:</strong> Herida sangrante. +5 PV y sangra.", aturdido: false },
                        "C": { pv: 8, txt: "🦴 <strong>Rango C:</strong> Rompe costilla. +8 PV y **Aturdido 1 asalto**.", aturdido: true },
                        "D": { pv: 12, txt: "💀 <strong>Rango D:</strong> Golpe severo. +12 PV y **Aturdido 2 asaltos**.", aturdido: true },
                        "E": { pv: 20, txt: "🦅 <strong>Rango E:</strong> ¡Corte arterial! +20 PV y **Aturdido 3 asaltos**.", aturdido: true }
                    };
                    pvCriticoExtra = mapas[rangoCritico].pv; descCritico = mapas[rangoCritico].txt + descCritico;
                    if (mapas[rangoCritico].aturdido) { nuevoAturdidoDef = true; efectosEspecialesCritico.push("💥 ATURDIDO"); }
                } else if (tipoCategoriaTabla === 'contundente') {
                    const mapas = {
                        "A": { pv: 2, txt: "💥 <strong>Rango A:</strong> Contusión. +2 PV.", aturdido: false },
                        "B": { pv: 5, txt: "🦴 <strong>Rango B:</strong> Impacto sordo. +5 PV y **Aturdido 1 asalto**.", aturdido: true },
                        "C": { pv: 8, txt: "🧠 <strong>Rango C:</strong> Traumatismo craneal. +8 PV y **Aturdido 2 asaltos**.", aturdido: true },
                        "D": { pv: 12, txt: "🦵 <strong>Rango D:</strong> Rompe hueso. +12 PV y **Aturdido 3 asaltos**.", aturdido: true },
                        "E": { pv: 20, txt: "💀 <strong>Rango E:</strong> Fractura aplastante. +20 PV e **Incapacitado 4 asaltos**.", aturdido: true }
                    };
                    pvCriticoExtra = mapas[rangoCritico].pv; descCritico = mapas[rangoCritico].txt + descCritico;
                    if (mapas[rangoCritico].aturdido) { nuevoAturdidoDef = true; efectosEspecialesCritico.push("💥 ATURDIDO"); }
                } else if (tipoCategoriaTabla === 'proyectil') {
                    const mapas = {
                        "A": { pv: 3, txt: "🎯 <strong>Rango A:</strong> Flecha alojada. +3 PV.", aturdido: false },
                        "B": { pv: 5, txt: "🩸 <strong>Rango B:</strong> Traspasa tejido. +5 PV.", aturdido: false },
                        "C": { pv: 8, txt: "🏹 <strong>Rango C:</strong> Perforación dolorosa. +8 PV y **Aturdido 1 asalto**.", aturdido: true },
                        "D": { pv: 12, txt: "👁️ <strong>Rango D:</strong> Impacto orgánico. +12 PV y **Aturdido 2 asaltos**.", aturdido: true },
                        "E": { pv: 22, txt: "💀 <strong>Rango E:</strong> Atraviesa zona vital. +22 PV e **Inconsciente**.", aturdido: true }
                    };
                    pvCriticoExtra = mapas[rangoCritico].pv; descCritico = mapas[rangoCritico].txt + descCritico;
                    if (mapas[rangoCritico].aturdido) { nuevoAturdidoDef = true; efectosEspecialesCritico.push("💥 ATURDIDO"); }
                }
            } else {
                descCritico = "⚔️ Golpe directo sin efectos críticos graves.";
            }

            dañoAplicadoDefensor = pvDañoBase + pvCriticoExtra;
            estadoFinalAtacante = "Listo";
            
            if (dañoAplicadoDefensor > 0) {
                estadoFinalDefensor = efectosEspecialesCritico.length > 0 ? efectosEspecialesCritico.join(' | ') : "Herido Leve";
            } else {
                estadoFinalDefensor = "Ileso";
            }

            respuestaCombate = `
                <div style="font-size: 26px; color: #ffcc00; font-weight: bold; margin-bottom: 12px;">
                    💥 Daño Total: ${dañoAplicadoDefensor} PV 💥
                </div>
                <div style="background-color: #252525; padding: 12px; border-radius: 6px; border-left: 4px solid #b71c1c; text-align: left; font-size: 15px;">
                    ${descCritico}
                </div>
            `;
        }

        // --- 📊 OPERACIÓN MATEMÁTICA EN LAS CASILLAS ---
        let pvDefRestantes = Math.max(0, pvDefInicial - dañoAplicadoDefensor);
        let pvAtqRestantes = Math.max(0, pvAtqInicial - dañoAplicadoAtacante);

        if (pvDefRestantes <= 0) estadoFinalDefensor = "💀 INCONSCIENTE / MUERTO";
        if (pvAtqRestantes <= 0) estadoFinalAtacante = "💀 INCONSCIENTE (Pifia)";

        // 🌟 REGLA DE ORO: ACTUALIZAR LOS INPUTS EN LA PANTALLA REAL 🌟
        document.getElementById('pv-atq').value = pvAtqRestantes;
        document.getElementById('pv-def').value = pvDefRestantes;

        // Automatización de estados de MERP para el próximo turno
        if (nuevoAturdidoDef) {
            document.getElementById('mod-def-aturdido').checked = true;
        }
        if (nuevoAturdidoAtq) {
            document.getElementById('mod-atq-aturdido').checked = true;
        }
        // La sorpresa se consume tras el primer golpe
        document.getElementById('mod-def-sorprendido').checked = false;

        // Cosmética final para la bitácora
        const nombresArmas = {
            espada_ancha: "Espada Ancha", espada_corta: "Espada Corta", daga: "Daga", cimitarra: "Cimitarra",
            maza: "Maza", martillo: "Martillo de Guerra", gran_hacha: "Gran Hacha", mandoble: "Mandoble",
            arco_largo: "Arco Largo", arco_corto: "Arco Corto", honda: "Honda"
        };
        const nombresRazas = { 
            humano: "Humano Dúnadan", rohirrim: "Humano Rohirrim", elfo: "Alto Elfo", elfo_silvano: "Elfo Silvano",
            enano: "Enano", hobbit: "Hobbit", orco: "Uruk-hai", orco_comun: "Orco Snaga", trol: "Trol Olog-hai" 
        };
        const desgloseDadosImpresion = logTiradas.map(n => n < 0 ? `(${n})` : n).join(' + ');

        resultBox.innerHTML = `
            <h3 style="color:#ffcc00; border-bottom: 1px solid #8b7355; padding-bottom: 8px; margin-top: 0;">⚔️ Crónica de Combate Táctico ⚔️</h3>
            
            <table style="width:100%; border-collapse: collapse; margin-bottom: 15px; font-size:14px; background-color:#1a1a1a; border-radius:6px; overflow:hidden;">
                <thead>
                    <tr style="background-color:#2a2a2a; color:#ffcc00; text-align:left;">
                        <th style="padding:8px; border: 1px solid #333;">Combatiente</th>
                        <th style="padding:8px; border: 1px solid #333; text-align:center;">PV Antes</th>
                        <th style="padding:8px; border: 1px solid #333; text-align:center;">Daño</th>
                        <th style="padding:8px; border: 1px solid #333; text-align:center;">PV Después</th>
                        <th style="padding:8px; border: 1px solid #333;">Estado Final</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding:8px; border: 1px solid #333;"><strong>Atacante</strong></td>
                        <td style="padding:8px; border: 1px solid #333; text-align:center; color:#ccc;">${pvAtqInicial}</td>
                        <td style="padding:8px; border: 1px solid #333; text-align:center; color:#ff4d4d;">${dañoAplicadoAtacante > 0 ? '-' + dañoAplicadoAtacante : '0'}</td>
                        <td style="padding:8px; border: 1px solid #333; text-align:center; color:#00ff66; font-weight:bold;">${pvAtqRestantes}</td>
                        <td style="padding:8px; border: 1px solid #333; font-size:12px; color:#ddd;">${estadoFinalAtacante}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border: 1px solid #333;"><strong>Defensor</strong></td>
                        <td style="padding:8px; border: 1px solid #333; text-align:center; color:#ccc;">${pvDefInicial}</td>
                        <td style="padding:8px; border: 1px solid #333; text-align:center; color:#ff4d4d;">${dañoAplicadoDefensor > 0 ? '-' + dañoAplicadoDefensor : '0'}</td>
                        <td style="padding:8px; border: 1px solid #333; text-align:center; color:#00ff66; font-weight:bold;">${pvDefRestantes}</td>
                        <td style="padding:8px; border: 1px solid #333; font-size:12px; font-weight:bold; color:#ffcc00;">${estadoFinalDefensor}</td>
                    </tr>
                </tbody>
            </table>

            <p style="font-size: 14px; color: #aaa; margin: 4px 0; text-align:left;">
                <strong>Secuencia de Dados:</strong> [${desgloseDadosImpresion}]${tipoDeTiradaTexto}
            </p>
            <p style="font-size: 14px; color: #aaa; margin: 4px 0; text-align:left;">
                <strong>Cálculo:</strong> ${totalDados} (Dados) + ${boFinal} (BO) - ${bdFinal} (BD) = <strong>${resultadoTabla}</strong> en Tabla.
            </p>
            
            <hr style="border-color: #444; margin: 15px 0;">
            ${respuestaCombate}
        `;
        resultBox.style.display = 'block';
        
    }, 1000);
});
