const bibliotecaNarrativa = {
    pifias: {
        filo: [
            "¡Un error fatal! El atacante calcula mal la trayectoria, tropieza y su propio filo dibuja un surco sangriento en su antebrazo.",
            "¡El acero ruge contra el propio portador! En un intento de finta veloz, el arma rebota contra una piedra hiriendo la pierna del atacante."
        ],
        contundente: [
            "¡Inercia desastrosa! Fuerza el golpe con tanta violencia que la muñeca le cruje, quedando dolorida para el resto del asalto.",
            "¡El golpe va completamente al aire! El peso del arma desequilibra al atacante, dislocándole el hombro levemente."
        ],
        dos_manos: [
            "¡El peso de la codicia! Levanta el arma pesada perdiendo el equilibrio. El hierro muerde el fango arrojándolo al suelo de espaldas.",
            "¡Fallo colosal! El impulso hace girar al atacante sobre su propio eje, cayendo de rodillas de forma humillante."
        ],
        proyectil: [
            "¡CHAS! Al tensar el arco más allá de los límites, la madera noble cede y la cuerda estalla golpeando el rostro del tirador.",
            "La cuerda se enreda de forma nefasta. El proyectil sale desviado hacia el cielo mientras el impacto magulla los dedos del tirador."
        ]
    },
    golpesNormales: {
        fallo: [
            "El ataque desciende con fuerza, pero el defensor ejecuta una finta elegante dejando que el aire sea el único damnificado.",
            "El golpe impacta de lleno, pero la gruesa protección absorbe toda la energía. Solo se escucha el eco del acero frustrado."
        ],
        leve: [
            "Un ataque rápido y preciso. Consigue esquivar las defensas mayores y traza un corte menor en la carne del rival.",
            "El golpe conecta sólidamente. No hay huesos rotos, pero el impacto rompe el cuero y deja un doloroso hematoma."
        ]
    },
    criticos: {
        A: ["¡Un golpe certero! El acero raspa la armadura y arranca un quejido. Un corte limpio que tiñe la ropa de color carmesí."],
        B: ["¡Impacto directo! El arma penetra con saña el tejido blando. El defensor da un paso atrás mientras la sangre empieza a brotar."],
        C: ["¡Crujido de guerra! Un golpe devastador quiebra las costillas del objetivo. El aire escapa de sus pulmones de golpe."],
        D: ["¡Ataque brutal! La fuerza del golpe desgarra músculos y astilla el hueso interno. El defensor queda conmocionado."],
        E: ["¡Un golpe digno de las canciones de los bardos! El impacto destroza la defensa biológica del rival en una explosión de violencia visceral."]
    }
};

document.getElementById('roll-btn').addEventListener('click', function() {
    // Encapsulamos todo en un bloque TRY para capturar errores si los hubiera
    try {
        const razaAtq = document.getElementById('raza-atq').value;
        const armaSeleccionada = document.getElementById('arma').value;
        let boBase = parseInt(document.getElementById('bo').value) || 0;
        let pvAtqInicial = parseInt(document.getElementById('pv-atq').value) || 0;
        
        const razaDef = document.getElementById('raza-def').value;
        const ta = parseInt(document.getElementById('ta').value) || 1;
        let bdBase = parseInt(document.getElementById('bd').value) || 0;
        let pvDefInicial = parseInt(document.getElementById('pv-def').value) || 0;
        
        const llevaEscudo = document.getElementById('def-escudo').checked;
        let puntosParar = parseInt(document.getElementById('def-parar').value) || 0;
        
        let modFlanco = document.getElementById('mod-flanco').checked;
        let modEspalda = document.getElementById('mod-espalda').checked;
        let modAtqAturdido = document.getElementById('mod-atq-aturdido').checked;
        let modAtqHerido = document.getElementById('mod-atq-herido').checked;
        let modDefAturdido = document.getElementById('mod-def-aturdido').checked;
        let modDefSorprendido = document.getElementById('mod-def-sorprendido').checked;

        const diceContainer = document.getElementById('dice-container');
        const resultBox = document.getElementById('result-box');
        const containerPrincipal = document.querySelector('.combat-container');
        const boxDefensor = document.querySelector('.character-box.defender');
        const boxAtacante = document.querySelector('.character-box.attacker');
        
        // Reset de clases animadas
        boxDefensor.classList.remove('flash-damage');
        boxAtacante.classList.remove('flash-damage');
        containerPrincipal.classList.remove('shake-effect');

        // Efecto visual de giro
        diceContainer.innerText = "...";
        diceContainer.classList.add('spinning');
        resultBox.style.display = 'none';
        
        setTimeout(() => {
            try {
                diceContainer.classList.remove('spinning');
                
                // Sistema de dados abiertos MERP
                let dadoOriginal = Math.floor(Math.random() * 100) + 1;
                let totalDados = dadoOriginal;
                let logTiradas = [dadoOriginal];
                let tipoDeTiradaTexto = "";

                if (dadoOriginal >= 96) {
                    tipoDeTiradaTexto = ` <span style="color:#00ff66;">(¡Abierta Arriba!)</span>`;
                    while (dadoOriginal >= 96) {
                        dadoOriginal = Math.floor(Math.random() * 100) + 1;
                        totalDados += dadoOriginal;
                        logTiradas.push(dadoOriginal);
                    }
                } else if (dadoOriginal <= 5) {
                    tipoDeTiradaTexto = ` <span style="color:#ff3333;">(¡Abierta Abajo!)</span>`;
                    let dadoResta = Math.floor(Math.random() * 100) + 1;
                    totalDados -= dadoResta;
                    logTiradas.push(-dadoResta);
                    while (dadoResta >= 96) {
                        dadoResta = Math.floor(Math.random() * 100) + 1;
                        totalDados -= dadoResta;
                        logTiradas.push(-dadoResta);
                    }
                }
                
                // Mostramos el número final
                diceContainer.innerText = totalDados;

                // Clasificación de armas
                let tipoCategoriaTabla = 'filo';
                if (["maza", "martillo"].includes(armaSeleccionada)) tipoCategoriaTabla = 'contundente';
                if (["gran_hacha", "mandoble"].includes(armaSeleccionada)) tipoCategoriaTabla = 'dos_manos';
                if (["arco_largo", "arco_corto", "honda"].includes(armaSeleccionada)) tipoCategoriaTabla = 'proyectil';

                let modBO = 0; 
                let modBD = 0; 
                let mitigacionDañoracial = 0;

                // Modificadores raciales Atacante
                if (razaAtq === 'elfo' && ['espada_ancha', 'espada_corta', 'arco_largo', 'arco_corto'].includes(armaSeleccionada)) modBO += 10;
                else if (razaAtq === 'elfo_silvano' && ['arco_largo', 'arco_corto'].includes(armaSeleccionada)) modBO += 15;
                else if (razaAtq === 'rohirrim' && ['espada_ancha', 'espada_corta'].includes(armaSeleccionada)) modBO += 10;
                else if (razaAtq === 'enano' && armaSeleccionada === 'gran_hacha') modBO += 10;
                else if (razaAtq === 'orco' && ['espada_ancha', 'cimitarra', 'maza', 'gran_hacha'].includes(armaSeleccionada)) modBO += 5;
                else if (razaAtq === 'orco_comun') { modBO -= 5; if (modFlanco || modEspalda) modBO += 10; }
                else if (razaAtq === 'trol') { if (tipoCategoriaTabla === 'dos_manos') modBO += 20; if (tipoCategoriaTabla === 'proyectil') modBO -= 50; }
                else if (razaAtq === 'hobbit' && armaSeleccionada === 'honda') modBO += 15;
                if (razaAtq === 'hobbit' && tipoCategoriaTabla === 'dos_manos') modBO -= 30;

                // Modificadores tácticos Atacante
                if (modFlanco) modBO += 15;
                if (modEspalda) modBO += 35;
                if (modAtqAturdido) modBO -= 20;
                if (modAtqHerido) modBO -= 10;

                // Modificadores raciales Defensor
                if (razaDef === 'hobbit') modBD += 15;
                else if (razaDef === 'elfo') modBD += 5;
                else if (razaDef === 'elfo_silvano') modBD += 10;
                else if (razaDef === 'enano') mitigacionDañoracial = 2;
                else if (razaDef === 'trol') { modBD -= 15; mitigacionDañoracial = 8; }

                // Modificadores tácticos Defensor
                if (llevaEscudo && !modEspalda && !modDefAturdido) modBD += 20;
                if (puntosParar > 0 && !modDefAturdido && !modDefSorprendido && !modEspalda) modBD += puntosParar;
                if (modDefAturdido) modBD -= bdBase;
                if (modDefSorprendido) modBD -= 20;

                let boFinal = boBase + modBO;
                let bdFinal = bdBase + modBD;
                let resultadoTabla = totalDados + boFinal - bdFinal;

                let dañoAplicadoDefensor = 0;
                let dañoAplicadoAtacante = 0;
                let estadoFinalAtacante = "Saludable";
                let estadoFinalDefensor = "Saludable";
                let cronicaNarrativa = "";
                
                let nuevoAturdidoDef = false;
                let nuevoAturdidoAtq = false;
                let esPifia = logTiradas[0] <= 4;

                if (esPifia) {
                    const pifiasOpciones = bibliotecaNarrativa.pifias[tipoCategoriaTabla];
                    cronicaNarrativa = pifiasOpciones[Math.floor(Math.random() * pifiasOpciones.length)];
                    boxAtacante.classList.add('flash-damage');

                    if (tipoCategoriaTabla === 'filo') { dañoAplicadoAtacante = 5; estadoFinalAtacante = "⚠️ HERIDO Y ATURDIDO"; nuevoAturdidoAtq = true; }
                    else if (tipoCategoriaTabla === 'contundente') { estadoFinalAtacante = "⚠️ MUÑECA LESIONADA (-15 BO)"; }
                    else if (tipoCategoriaTabla === 'dos_manos') { estadoFinalAtacante = "⚠️ DERRIBADO Y ATURDIDO"; nuevoAturdidoAtq = true; }
                    else if (tipoCategoriaTabla === 'proyectil') { dañoAplicadoAtacante = 3; estadoFinalAtacante = "⚠️ HERIDO Y ATURDIDO"; nuevoAturdidoAtq = true; }
                    estadoFinalDefensor = "Ileso";
                } else {
                    let pvDañoBase = 0;
                    let rangoCritico = "Ninguno";
                    let pvCriticoExtra = 0;

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

                    if (mitigacionDañoracial > 0 && pvDañoBase > 0) {
                        pvDañoBase = Math.max(1, pvDañoBase - mitigacionDañoracial);
                    }

                    if (resultadoTabla <= 40 || pvDañoBase === 0) {
                        const opcionesFallo = bibliotecaNarrativa.golpesNormales.fallo;
                        cronicaNarrativa = opcionesFallo[Math.floor(Math.random() * opcionesFallo.length)];
                    } else if (rangoCritico === "Ninguno") {
                        const opcionesLeve = bibliotecaNarrativa.golpesNormales.leve;
                        cronicaNarrativa = opcionesLeve[Math.floor(Math.random() * opcionesLeve.length)];
                        boxDefensor.classList.add('flash-damage');
                    } else {
                        const textosCriticos = bibliotecaNarrativa.criticos[rangoCritico];
                        cronicaNarrativa = textosCriticos[Math.floor(Math.random() * textosCriticos.length)];
                        boxDefensor.classList.add('flash-damage');
                        
                        if (["C", "D", "E"].includes(rangoCritico)) {
                            containerPrincipal.classList.add('shake-effect');
                        }

                        const mapasValores = {
                            "A": { pv: 3, aturdido: false, txt: "💥 ATURDIDO" },
                            "B": { pv: 5, aturdido: false, txt: "🩸 SANGRANDO" },
                            "C": { pv: 8, aturdido: true, txt: "🦴 ROTURA" },
                            "D": { pv: 12, aturdido: true, txt: "💀 TRAUMA SEVERO" },
                            "E": { pv: 20, aturdido: true, txt: "🦅 CRÍTICO MORTAL" }
                        };
                        
                        pvCriticoExtra = mapasValores[rangoCritico].pv;
                        if (mapasValores[rangoCritico].aturdido) nuevoAturdidoDef = true;
                        estadoFinalDefensor = mapasValores[rangoCritico].txt;
                    }

                    dañoAplicadoDefensor = pvDañoBase + pvCriticoExtra;
                    estadoFinalAtacante = "Listo";
                    if (dañoAplicadoDefensor > 0 && rangoCritico === "Ninguno") estadoFinalDefensor = "Herido Leve";
                    if (dañoAplicadoDefensor === 0) estadoFinalDefensor = "Ileso";
                }

                let pvDefRestantes = Math.max(0, pvDefInicial - dañoAplicadoDefensor);
                let pvAtqRestantes = Math.max(0, pvAtqInicial - dañoAplicadoAtacante);

                if (pvDefRestantes <= 0) {
                    estadoFinalDefensor = "💀 MUERTO / INCONSCIENTE";
                    cronicaNarrativa += " El golpe apaga la luz de sus ojos; cae desplomado sobre la tierra.";
                }

                // Actualizar cajas de texto numéricas
                document.getElementById('pv-atq').value = pvAtqRestantes;
                document.getElementById('pv-def').value = pvDefRestantes;

                // ACTUALIZACIÓN DE BARRAS DE VIDA (Escala real 0-100)
                const barAtq = document.getElementById('bar-atq');
                const barDef = document.getElementById('bar-def');

                if (barAtq) {
                    barAtq.style.width = `${pvAtqRestantes}%`;
                    if (pvAtqRestantes < 30) barAtq.style.background = "linear-gradient(90deg, #ff3333, #cc0000)";
                    else if (pvAtqRestantes < 60) barAtq.style.background = "linear-gradient(90deg, #ffcc00, #ff9900)";
                    else barAtq.style.background = "linear-gradient(90deg, #00ff66, #00cc44)";
                }
                if (barDef) {
                    barDef.style.width = `${pvDefRestantes}%`;
                    if (pvDefRestantes < 30) barDef.style.background = "linear-gradient(90deg, #ff3333, #cc0000)";
                    else if (pvDefRestantes < 60) barDef.style.background = "linear-gradient(90deg, #ffcc00, #ff9900)";
                    else barDef.style.background = "linear-gradient(90deg, #00ff66, #00cc44)";
                }

                if (nuevoAturdidoDef) document.getElementById('mod-def-aturdido').checked = true;
                if (nuevoAturdidoAtq) document.getElementById('mod-atq-aturdido').checked = true;
                document.getElementById('mod-def-sorprendido').checked = false;

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

                // Pintamos los resultados
                resultBox.innerHTML = `
                    <h3 style="color:#ffcc00; border-bottom: 1px solid #3a3a3a; padding-bottom: 8px; margin-top: 0;">📖 Registro del Tabardo del Cronista</h3>
                    <div style="background-color: #151515; border-left: 4px solid #ffcc00; padding: 12px; border-radius: 4px; font-style: italic; font-size: 15px; color: #f0e6d2; margin-bottom: 15px;">
                        "${cronicaNarrativa}"
                    </div>
                    <table style="width:100%; border-collapse: collapse; margin-bottom: 15px; font-size:14px; background-color:#1a1a1a;">
                        <thead>
                            <tr style="background-color:#2a2a2a; color:#ffcc00; text-align:left;">
                                <th style="padding:8px; border: 1px solid #333;">Combatiente</th>
                                <th style="padding:8px; border: 1px solid #333; text-align:center;">PV Antes</th>
                                <th style="padding:8px; border: 1px solid #333; text-align:center;">Daño</th>
                                <th style="padding:8px; border: 1px solid #333; text-align:center;">PV Después</th>
                                <th style="padding:8px; border: 1px solid #333;">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding:8px; border: 1px solid #333;">Atacante (${nombresRazas[razaAtq]})</td>
                                <td style="padding:8px; border: 1px solid #333; text-align:center; color:#aaa;">${pvAtqInicial}</td>
                                <td style="padding:8px; border: 1px solid #333; text-align:center; color:#ff4d4d;">${dañoAplicadoAtacante > 0 ? '-' + dañoAplicadoAtacante : '0'}</td>
                                <td style="padding:8px; border: 1px solid #333; text-align:center; color:#00ff66; font-weight:bold;">${pvAtqRestantes}</td>
                                <td style="padding:8px; border: 1px solid #333; font-size:12px;">${estadoFinalAtacante}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px; border: 1px solid #333;">Defensor (${nombresRazas[razaDef]})</td>
                                <td style="padding:8px; border: 1px solid #333; text-align:center; color:#aaa;">${pvDefInicial}</td>
                                <td style="padding:8px; border: 1px solid #333; text-align:center; color:#ff4d4d;">${dañoAplicadoDefensor > 0 ? '-' + dañoAplicadoDefensor : '0'}</td>
                                <td style="padding:8px; border: 1px solid #333; text-align:center; color:#00ff66; font-weight:bold;">${pvDefRestantes}</td>
                                <td style="padding:8px; border: 1px solid #333; font-size:12px; font-weight:bold; color:#ffcc00;">${estadoFinalDefensor}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="font-size: 12px; color: #888; background: #111; padding: 10px; border-radius: 4px;">
                        <strong>Mesa:</strong> [${desgloseDadosImpresion}]${tipoDeTiradaTexto}<br>
                        <strong>Fórmula:</strong> Dados (${totalDados}) + BO (${boFinal}) - BD (${bdFinal}) = <strong>${resultadoTabla}</strong> (${nombresArmas[armaSeleccionada]}).
                    </div>
                `;
                resultBox.style.display = 'block';
            } catch (errInner) {
                // Alerta si el fallo ocurre dentro del calculador diferido
                alert("Error en el cálculo: " + errInner.message);
            }
        }, 1000);

    } catch (errOuter) {
        // Alerta si no se encuentran los IDs principales al hacer click
        alert("Error de elementos HTML faltantes: " + errOuter.message);
    }
});
