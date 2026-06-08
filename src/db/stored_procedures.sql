-- ============================================================
-- Stored Procedures para Estadísticas de Atenciones (Admin)
-- Proyecto: TFI Programación III - Grupo M
-- Integrante 5: Martin
-- ============================================================
-- Para importar: ejecutar este archivo en la base de datos `prog3_turnos`
-- ============================================================

DELIMITER $$

-- ============================================================
-- 1. sp_turnos_por_medico
-- Muestra cantidad de turnos y valor total generado por cada médico
-- ============================================================
CREATE PROCEDURE IF NOT EXISTS sp_turnos_por_medico()
BEGIN
    SELECT 
        m.id_medico,
        u.apellido AS medico_apellido,
        u.nombres AS medico_nombres,
        e.nombre AS especialidad,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        SUM(tr.valor_total) AS total_generado,
        SUM(CASE WHEN tr.atentido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
        SUM(CASE WHEN tr.atentido = 0 THEN 1 ELSE 0 END) AS turnos_pendientes
    FROM turnos_reservas tr
    JOIN medicos m ON tr.id_medico = m.id_medico
    JOIN usuarios u ON m.id_usuario = u.id_usuario
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE tr.activo = 1
    GROUP BY m.id_medico, u.apellido, u.nombres, e.nombre
    ORDER BY cantidad_turnos DESC;
END$$

-- ============================================================
-- 2. sp_turnos_por_obra_social
-- Muestra cantidad de turnos y valor por obra social
-- ============================================================
CREATE PROCEDURE IF NOT EXISTS sp_turnos_por_obra_social()
BEGIN
    SELECT 
        os.id_obra_social,
        os.nombre AS obra_social,
        os.porcentaje_descuento,
        CASE WHEN os.es_particular = 1 THEN 'Sí' ELSE 'No' END AS es_particular,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        SUM(tr.valor_total) AS total_generado
    FROM turnos_reservas tr
    JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
    WHERE tr.activo = 1
    GROUP BY os.id_obra_social, os.nombre, os.porcentaje_descuento, os.es_particular
    ORDER BY cantidad_turnos DESC;
END$$

-- ============================================================
-- 3. sp_turnos_por_estado
-- Muestra resumen de turnos atendidos vs pendientes
-- ============================================================
CREATE PROCEDURE IF NOT EXISTS sp_turnos_por_estado()
BEGIN
    SELECT 
        CASE WHEN tr.atentido = 0 THEN 'Pendiente' ELSE 'Atendido' END AS estado,
        COUNT(*) AS cantidad,
        SUM(tr.valor_total) AS total
    FROM turnos_reservas tr
    WHERE tr.activo = 1
    GROUP BY tr.atentido;
END$$

-- ============================================================
-- 4. sp_turnos_por_rango_fechas
-- Recibe fecha_desde y fecha_hasta, devuelve turnos en ese rango
-- ============================================================
CREATE PROCEDURE IF NOT EXISTS sp_turnos_por_rango_fechas(
    IN fecha_desde DATE,
    IN fecha_hasta DATE
)
BEGIN
    SELECT 
        tr.id_turno_reserva,
        tr.fecha_hora,
        tr.valor_total,
        CASE WHEN tr.atentido = 1 THEN 'Atendido' ELSE 'Pendiente' END AS estado,
        u_med.apellido AS medico_apellido,
        u_med.nombres AS medico_nombres,
        e.nombre AS especialidad,
        u_pac.apellido AS paciente_apellido,
        u_pac.nombres AS paciente_nombres,
        os.nombre AS obra_social
    FROM turnos_reservas tr
    JOIN medicos m ON tr.id_medico = m.id_medico
    JOIN usuarios u_med ON m.id_usuario = u_med.id_usuario
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    JOIN pacientes p ON tr.id_paciente = p.id_paciente
    JOIN usuarios u_pac ON p.id_usuario = u_pac.id_usuario
    JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
    WHERE tr.activo = 1
      AND DATE(tr.fecha_hora) >= fecha_desde
      AND DATE(tr.fecha_hora) <= fecha_hasta
    ORDER BY tr.fecha_hora;
END$$

-- ============================================================
-- 5. sp_estadisticas_dashboard
-- Devuelve un resumen general para el panel del administrador
-- ============================================================
CREATE PROCEDURE IF NOT EXISTS sp_estadisticas_dashboard()
BEGIN
    DECLARE total_turnos INT;
    DECLARE total_ingresos DECIMAL(10,2);
    DECLARE total_medicos INT;
    DECLARE total_pacientes INT;
    DECLARE total_obras_sociales INT;
    DECLARE promedio_valor_turno DECIMAL(10,2);

    SELECT COUNT(*) INTO total_turnos FROM turnos_reservas WHERE activo = 1;
    SELECT SUM(valor_total) INTO total_ingresos FROM turnos_reservas WHERE activo = 1;
    SELECT COUNT(*) INTO total_medicos FROM medicos;
    SELECT COUNT(*) INTO total_pacientes FROM pacientes;
    SELECT COUNT(*) INTO total_obras_sociales FROM obras_sociales WHERE activo = 1;
    SELECT COALESCE(AVG(valor_total), 0) INTO promedio_valor_turno FROM turnos_reservas WHERE activo = 1;

    SELECT 
        total_turnos AS total_turnos,
        total_ingresos AS total_ingresos,
        total_medicos AS total_medicos,
        total_pacientes AS total_pacientes,
        total_obras_sociales AS total_obras_sociales,
        promedio_valor_turno AS promedio_valor_turno;
END$$

DELIMITER ;
