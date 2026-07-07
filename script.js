document.getElementById('roll-btn').addEventListener('click', function() {
    // Captura de datos
    const razaAtq = document.getElementById('raza-atq').value;
    const armaSeleccionada = document.getElementById('arma').value;
    let boBase = parseInt(document.getElementById('bo').value) || 0;
    
    const razaDef = document.getElementById('raza-def').value;
    const ta = parseInt(document.getElementById('ta').value) || 1;
    let bdBase = parseInt(document.getElementById('bd').value) || 0;
    
    // Estado y defensas activas
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
        
        // --- 🎲 SISTEMA DE DADOS TOTAL DE MERP (ABIERTAS ARRIBA Y ABAJO) ---
        let dadoOriginal = Math.floor(Math.random() * 100) + 1;
        let totalDados = dadoOriginal;
        let logTiradas = [dadoOriginal];
        let tipoDeTiradaTexto = "";

        if (dadoOriginal >= 96) {
            // Tirada Abierta hacia Arriba (Línea de Suerte)
            tipoDeTiradaTexto = ` <span style="color:#00ff66;">(¡Tirada Abierta hacia Arriba!)</span>`;
            while (dadoOriginal >= 96) {
                dadoOriginal = Math.floor(Math.random() * 100) + 1;
                totalDados += dadoOriginal;
                logTiradas.push(dadoOriginal);
            }
        } else if (dadoOriginal <= 5) {
            // Tirada Abierta hacia Abajo (Infortunio del Destino)
            tipoDeTiradaTexto = ` <span style="color:#ff3333;">(¡Tirada Abierta hacia Abajo!)</span>`;
            let dadoResta = Math.floor(Math.random() * 100) + 1;
            totalDados -= dadoResta;
            logTiradas.push(-dadoResta);
            // Si el dado restado es un éxito crítico en su propia escala, sigue restando
            while (dadoResta >= 96) {
                dadoResta = Math.floor(Math.random() * 100) + 1;
                totalDados -= dadoResta;
                logTiradas.push(-dadoResta);
            }
        }
        diceContainer.innerText = totalDados;

        // Clasificar categoría de arma
        let tipoCategoriaTabla = 'filo';
        if (["maza", "martillo"].includes(armaSeleccionada)) tipoCategoriaTabla = 'contundente';
        if (["gran_hacha", "mandoble"].includes(armaSeleccionada)) tipoCategoriaTabla = 'dos_manos';
        if (["arco_largo", "arco_corto", "honda"].includes(armaSeleccionada)) tipoCategoriaTabla = 'proyectil';

        // --- CÁLCULO DE MODIFICADORES ---
        let modBO = 0;
        let desgloseTextoBO = [];
        let modBD = 0;
        let desgloseTextoBD = [];
        let mitigacionEnano = 0;

        // Modificadores Raciales Atacante
        if (razaAtq === 'elfo' && ['espada_ancha', 'espada_corta', 'arco_largo', 'arco_corto'].includes(armaSeleccionada)) {
            modBO += 10; desgloseTextoBO.push("+10 Racial Elfo");
        } else if (razaAtq === 'enano' && armaSeleccionada === 'gran_hacha') {
            modBO += 10; desgloseTextoBO.push("+10 Orgullo Enano");
        } else if (razaAtq === 'orco' && ['espada_ancha', 'cimitarra', 'maza', 'gran_hacha'].includes(armaSeleccionada)) {
            modBO += 5; desgloseTextoBO.push("+5 Furia Orca");
        } else if (razaAtq === 'orco' && tipoCategoriaTabla === 'proyectil') {
            modBO -= 10; desgloseTextoBO.push("-10 Estorbo del Sol");
        } else if (razaAtq === 'hobbit' && armaSeleccionada === 'honda') {
            modBO += 15; desgloseTextoBO.push("+15 Puntería de la Comarca");
        } else if (razaAtq === 'humano') {
            modBO += 5; desgloseTextoBO.push("+5 Linaje Humano");
        }

        // Restricción de tamaño oficial
        if (razaAtq === 'hobbit' && tipoCategoriaTabla === 'dos_manos') {
            modBO -= 30; desgloseTextoBO.push("<span style='color:#ff4d4d;'>-30 Tamaño (Incapaz de blandir Arma a 2M)</span>");
        }

        // Modificadores de situación Atacante
        if (modFlanco) { modBO += 15; desgloseTextoBO.push("+15 Flanco"); }
        if (modEspalda) { modBO += 35; desgloseTextoBO.push("+35 Espalda"); }
        if (modAtqAturdido) { modBO -= 20; desgloseTextoBO.push("-20 Aturdido"); }
        if (modAtqHerido) { modBO -= 10; desgloseTextoBO.push("-10 Herido"); }

        // Modificadores Raciales Defensor
        if (razaDef === 'hobbit') { modBD += 15; desgloseTextoBD.push("+15 Tamaño Escurridizo"); }
        if (razaDef === 'elfo') { modBD += 5; desgloseTextoBD.push("+5 Reflejos Noldor"); }
        if (razaDef === 'enano') { mitigacionEnano = 2; }

        // 🛡️ REGLAS DE ESCUDO REAL
        if (llevaEscudo) {
            if (modEspalda) {
                desgloseTextoBD.push("+0 Escudo (Inútil por la Espalda)");
            } else if (modDefAturdido) {
                desgloseTextoBD.push("+0 Escudo (Defensor incapaz de levantarlo por Aturdimiento)");
            } else {
                modBD += 20;
                desgloseTextoBD.push("+20 Escudo Activo");
            }
        }

        // ⚔️ REGLAS DE LA MECÁNICA DE PARAR
        if (puntosParar > 0) {
            if (modDefAturdido || modDefSorprendido || modEspalda) {
                desgloseTextoBD.push("+0 Parada (Imposible parar Aturdido, Sorprendido o por la Espalda)");
            } else {
                modBD += puntosParar;
                desgloseTextoBD.push(`+${puntosParar} Parada con Arma`);
            }
        }

        // Estados perjudiciales del defensor
        if (modDefAturdido) {
            modBD -= bdBase;
            desgloseTextoBD.push(`-${bdBase} Pérdida de BD Base por Aturdimiento`);
        }
        if (modDefSorprendido) { modBD -= 20; desgloseTextoBD.push("-20 Sorprendido"); }

        // Totales finales
        let boFinal = boBase + modBO;
        let bdFinal = bdBase + modBD;
        let resultadoTabla = totalDados + boFinal - bdFinal;

        // --- 💥 TABLA DE PIFIAS DINÁMICAS POR ARMA (DADO ORIGINAL 01-04) ---
        let respuestaCombate = "";
        let esPifia = logTiradas[0] <= 4;

        if (esPifia) {
            let textoPifia = "";
            if (tipoCategoriaTabla === 'filo') {
                textoPifia = "💥 <strong>PIFIA DE FILO:</strong> El arma resbala o impacta en falso contra la armadura enemiga. El atacante se corta a sí mismo sufriendo <strong>5 PV directos</strong>, queda <strong>Aturdido 1 asalto</strong> y el filo queda mellado (-5 al BO hasta afilarse).";
            } else if (tipoCategoriaTabla === 'contundente') {
                textoPifia = "💥 <strong>PIFIA CONTUNDENTE:</strong> Calculas mal el arco de golpeo y la inercia te disloca levemente la muñeca. El arma no impacta, sufres un dolor espantoso y arrastras un **-15 al BO durante los siguientes 3 asaltos**.";
            } else if (tipoCategoriaTabla === 'dos_manos') {
                textoPifia = "💥 <strong>PIFIA A DOS MANOS:</strong> ¡El brutal peso del arma te vence por completo! Fallas el golpe y te vas al suelo con estrépito. Quedas en **posición tendida (-30 BD)** y completamente **Aturdido durante 2 asaltos**.";
            } else if (tipoCategoriaTabla === 'proyectil') {
                textoPifia = "💥 <strong>PIFIA DE PROYECTIL:</strong> ¡La cuerda del arco se rompe con un violento restallido! El latigazo te golpea directamente en la cara: sufres <strong>3 PV</strong> y quedas **Aturdido 2 asaltos** buscando repuesto.";
            }

            respuestaCombate = `
                <div style="color: #ff4d4d; font-size: 22px; font-weight: bold; margin-bottom: 10px;">❌ ¡FALLO CRÍTICO / PIFIA REAL! ❌</div>
                <div style="background-color: #2b1111; padding: 14px; border-radius: 6px; border-left: 5px solid #ff4d4d; text-align: left; font-size: 15px; color:#ffb3b3;">
                    ${textoPifia}
                </div>
            `;
        } else {
            // --- CÓDIGO DE LAS TABLAS DE DAÑO NORMAL ---
            let pvDaño = 0;
            let rangoCritico = "Ninguno";
            let descCritico = "";

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
                else if (resultadoTabla <= 65) pvDaño = (ta <= 4) ? 4 : (ta >= 13) ? 5 : 2;
                else if (resultadoTabla <= 85) pvDaño = (ta <= 4) ? 9 : (ta >= 13) ? 10 : 6;
                else if (resultadoTabla <= 100) pvDaño = (ta <= 4) ? 14 : (ta >= 13) ? 15 : 10;
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 19 : 16; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = 22; rangoCritico = (ta >= 13) ? "B" : "A"; }
                else { pvDaño = 28; rangoCritico = (ta >= 13) ? "D" : "C"; }
            }
            else if (tipoCategoriaTabla === 'dos_manos') {
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

            // Mitigación Enana pasiva
            if (razaDef === 'enano' && pvDaño > 0) {
                pvDaño = Math.max(1, pvDaño - mitigacionEnano);
                descCritico += `<br><small style="color:#4da6ff;">🛡️ Robustez Enana: Absorbe ${mitigacionEnano} PV del golpe base.</small>`;
            }

            // Mensajes descriptivos de críticos
            if (rangoCritico !== "Ninguno") {
                if (tipoCategoriaTabla === 'filo' || tipoCategoriaTabla === 'dos_manos') {
                    const criticosCorte = {
                        "A": "⚔️ <strong>Crítico (Rango A):</strong> Tajo superficial. +3 PV extra y -5 a la acción por dolor.",
                        "B": "🩸 <strong>Crítico (Rango B):</strong> Herida sangrante. +5 PV extra y el rival sangra 1 PV/asalto.",
                        "C": "🦴 <strong>Crítico (Rango C):</strong> El filo quiebra una costilla. +8 PV extra y el rival queda **Aturdido 1 asalto**.",
                        "D": "💀 <strong>Crítico (Rango D):</strong> Golpe severo. +12 PV extra, enemigo **Aturdido 2 asaltos** y sangra 2 PV/asalto.",
                        "E": "🦅 <strong>Crítico (Rango E):</strong> ¡Corte arterial! +20 PV extra, derribado y **Aturdido durante 3 asaltos**."
                    };
                    descCritico = criticosCorte[rangoCritico] + descCritico;
                } else if (tipoCategoriaTabla === 'contundente') {
                    const criticosPorra = {
                        "A": "💥 <strong>Crítico (Rango A):</strong> Contusión severa. +2 PV extra y -5 de penalización.",
                        "B": "🦴 <strong>Crítico (Rango B):</strong> Impacto sordo. +5 PV extra y el defensor queda **Aturdido 1 asalto**.",
                        "C": "🧠 <strong>Crítico (Rango C):</strong> Traumatismo craneal. +8 PV extra y enemigo **Aturdido 2 asaltos**.",
                        "D": "🦵 <strong>Crítico (Rango D):</strong> Rompe hueso de soporte. +12 PV extra, cae de rodillas y **Aturdido 3 asaltos**.",
                        "E": "💀 <strong>Crítico (Rango E):</strong> Fractura múltiple aplastante. +20 PV extra y el rival queda **Incapacitado 4 asaltos**."
                    };
                    descCritico = criticosPorra[rangoCritico] + descCritico;
                } else if (tipoCategoriaTabla === 'proyectil') {
                    const criticosFlechazo = {
                        "A": "🎯 <strong>Crítico (Rango A):</strong> Flecha alojada. +3 PV extra y -5 general.",
                        "B": "🩸 <strong>Crítico (Rango B):</strong> Traspasa tejido blando. +5 PV extra y hemorragia de 1 PV/asalto.",
                        "C": "🏹 <strong>Crítico (Rango C):</strong> Perforación dolorosa. +8 PV extra, sangra 2 PV/asalto y queda **Aturdido 1 asalto**.",
                        "D": "👁️ <strong>Crítico (Rango D):</strong> Impacto orgánico grave. +12 PV extra y enemigo **Aturdido 2 asaltos**.",
                        "E": "💀 <strong>Crítico (Rango E):</strong> Atraviesa zona vital. +22 PV extra, cae inconsciente al suelo y **Aturdido 4 asaltos**."
                    };
                    descCritico = criticosFlechazo[rangoCritico] + descCritico;
                }
            } else {
                descCritico = "⚔️ Golpe directo sin efectos críticos de consideración.";
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
        
        // Nombres cosméticos
        const nombresArmas = {
            espada_ancha: "Espada Ancha", espada_corta: "Espada Corta", daga: "Daga", cimitarra: "Cimitarra",
            maza: "Maza", martillo: "Martillo de Guerra", gran_hacha: "Gran Hacha", mandoble: "Mandoble",
            arco_largo: "Arco Largo", arco_corto: "Arco Corto", honda: "Honda"
        };
        const nombresRazas = { humano: "Humano", elfo: "Elfo", enano: "Enano", orco: "Orco", hobbit: "Hobbit" };
        const desgloseDadosImpresion = logTiradas.map(n => n < 0 ? `(${n})` : n).join(' + ');

        // Render final del resultado
        resultBox.innerHTML = `
            <h3 style="color:#ffcc00; border-bottom: 1px solid #8b7355; padding-bottom: 8px; margin-top: 0;">⚔️ Crónica de Combate Táctico ⚔️</h3>
            
            <p style="font-size: 16px; margin: 6px 0;"><strong>Ataque:</strong> ${nombresRazas[razaAtq]} con <strong>${nombresArmas[armaSeleccionada]}</strong></p>
            <p style="font-size: 16px; margin: 6px 0;"><strong>Defensa:</strong> ${nombresRazas[razaDef]} (TA-${ta})</p>
            
            <div style="background-color:#111; padding: 8px; font-size:13px; text-align:left; border-radius:4px; margin: 10px 0; border: 1px solid #333; line-height:1.4;">
                <span style="color:#ff4d4d;"><strong>Modificadores de Ataque (BO):</strong></span> ${desgloseTextoBO.length > 0 ? desgloseTextoBO.join(' | ') : 'Ninguno (Base)'}<br>
                <span style="color:#3399ff;"><strong>Modificadores de Defensa (BD):</strong></span> ${desgloseTextoBD.length > 0 ? desgloseTextoBD.join(' | ') : 'Ninguno (Base)'}
            </div>

            <p style="font-size: 14px; color: #aaa; margin: 4px 0;">
                <strong>Secuencia de Dados:</strong> [${desgloseDadosImpresion}]${tipoDeTiradaTexto}
            </p>
            <p style="font-size: 14px; color: #aaa; margin: 4px 0;">
                <strong>Fórmula final:</strong> ${totalDados} (Dados) + ${boFinal} (BO Final) - ${bdFinal} (BD Final)
            </p>
            <p style="font-size: 20px; margin: 10px 0; color:#ffcc00;">Total final en Tabla: <strong>${resultadoTabla}</strong></p>
            <hr style="border-color: #444; margin: 15px 0;">
            ${respuestaCombate}
        `;
        resultBox.style.display = 'block';
        
    }, 1000);
});
