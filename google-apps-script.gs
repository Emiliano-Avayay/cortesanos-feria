const SHEET_ID = '1rNmGlFP6bpUj0koviAJ-HjxJZcuxcfyUH8aFk3XCq1U';
const SHEET_NAME = 'Reservas';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getOrCreateSheet_();
    ensureHeaders_(sheet);

    const data = e && e.parameter ? e.parameter : {};

    sheet.appendRow([
      new Date(),
      clean_(data.nombre),
      clean_(data.apellido),
      clean_(data.dni),
      clean_(data.telefono),
      clean_(data.tipoEntrada),
      clean_(data.formaPago),
      clean_(data.estadoPago) || clean_(data.pago) || 'Pendiente'
    ]);

    return json_({
      ok: true,
      message: 'Reserva guardada'
    });
  } catch (err) {
    return json_({
      ok: false,
      message: err.message
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({
    ok: true,
    message: 'Web App activo'
  });
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const headers = ['Fecha y Hora', 'Nombre', 'Apellido', 'DNI', 'Nro de Telefono', 'General o VIP', 'Forma de Pago', 'Estado Pago'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function clean_(value) {
  return String(value || '').trim();
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
