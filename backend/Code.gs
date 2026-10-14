// ======================================================

// MAGNIFIC CONTROL DE CRÉDITOS

// Backend Google Apps Script

// Versión multiprograma

// ======================================================





// ======================================================

// CONFIGURACIÓN

// ======================================================



var ALLOWED_KEYS = [

  'credit-entries',

  'credit-purchases',

  'settings',

  'programs'

];





// ======================================================

// RESPUESTA JSON

// ======================================================



function jsonResponse(data) {

  return ContentService

    .createTextOutput(JSON.stringify(data))

    .setMimeType(ContentService.MimeType.JSON);

}





// ======================================================

// AUTENTICACIÓN

// Contraseñas almacenadas en Script Properties

// ======================================================



function checkPassword(password) {



  var properties =

    PropertiesService.getScriptProperties();



  var userPassword =

    properties.getProperty('USER_PASSWORD');



  var adminPassword =

    properties.getProperty('ADMIN_PASSWORD');



  if (password === adminPassword) {

    return 'admin';

  }



  if (password === userPassword) {

    return 'user';

  }



  return null;

}





// ======================================================

// OBTENER HOJA

// ======================================================



function getSheet(sheetName) {



  var spreadsheet =

    SpreadsheetApp.getActiveSpreadsheet();



  var sheet =

    spreadsheet.getSheetByName(sheetName);



  if (!sheet) {

    sheet = spreadsheet.insertSheet(sheetName);

  }



  return sheet;

}





// ======================================================

// VALIDAR KEY

// ======================================================



function isAllowedKey(key) {

  return ALLOWED_KEYS.indexOf(key) !== -1;

}





// ======================================================

// NORMALIZAR FECHA

// ======================================================



function normalizeDate(value) {



  if (!value) {

    return '';

  }



  if (

    Object.prototype.toString.call(value)

      === '[object Date]'

  ) {



    return Utilities.formatDate(

      value,

      Session.getScriptTimeZone(),

      'yyyy-MM-dd'

    );

  }



  return String(value);

}





// ======================================================

// GENERACIONES

// ======================================================



function ensureGenerationHeaders(sheet) {



  sheet.getRange(1, 1, 1, 9).setValues([[

    'ID',

    'ProgramaID',

    'Episodio',

    'Fecha',

    'Creditos',

    'Descripcion',

    'Usada',

    'Archivada',

    'FechaArchivo'

  ]]);

}





function readGeneraciones() {



  var sheet = getSheet('Generaciones');



  var lastRow = sheet.getLastRow();



  if (lastRow < 2) {

    return [];

  }



  var data =

    sheet

      .getRange(2, 1, lastRow - 1, 9)

      .getValues();



  return data



    .filter(function(row) {

      return row[0] !== '';

    })



    .map(function(row) {



      var entry = {

        id: String(row[0]),

        programId: String(row[1] || ''),

        name: String(row[2]),

        date: normalizeDate(row[3]),

        credits: Number(row[4]) || 0,

        shotDescription: String(row[5] || ''),

        used: row[6] !== false,

        archived: row[7] === true

      };



      if (

        row[8] !== '' &&

        row[8] !== null

      ) {

        entry.archivedAt =

          Number(row[8]) || row[8];

      }



      return entry;

    });

}





function writeGeneraciones(entries) {



  if (!Array.isArray(entries)) {

    throw new Error('invalid_entries');

  }



  var sheet = getSheet('Generaciones');



  ensureGenerationHeaders(sheet);



  var lastRow = sheet.getLastRow();



  if (lastRow > 1) {

    sheet

      .getRange(2, 1, lastRow - 1, 9)

      .clearContent();

  }



  if (!entries.length) {

    return;

  }



  var rows = entries.map(function(entry) {



    return [

      entry.id || '',

      entry.programId || '',

      entry.name || '',

      entry.date || '',

      Number(entry.credits) || 0,

      entry.shotDescription || '',

      entry.used !== false,

      entry.archived === true,

      entry.archivedAt || ''

    ];

  });



  sheet

    .getRange(2, 1, rows.length, 9)

    .setValues(rows);

}





// ======================================================

// COMPRAS

// Bolsa global de créditos

// ======================================================



function ensurePurchaseHeaders(sheet) {



  sheet.getRange(1, 1, 1, 6).setValues([[

    'ID',

    'Concepto',

    'Fecha',

    'Creditos',

    'Costo',

    'Moneda'

  ]]);

}





function readCompras() {



  var sheet = getSheet('Compras');



  var lastRow = sheet.getLastRow();



  if (lastRow < 2) {

    return [];

  }



  var data =

    sheet

      .getRange(2, 1, lastRow - 1, 6)

      .getValues();



  return data



    .filter(function(row) {

      return row[0] !== '';

    })



    .map(function(row) {



      return {

        id: String(row[0]),

        label: String(row[1] || ''),

        date: normalizeDate(row[2]),

        credits: Number(row[3]) || 0,

        cost: Number(row[4]) || 0,

        currency: String(row[5] || '')

      };

    });

}





function writeCompras(purchases) {



  if (!Array.isArray(purchases)) {

    throw new Error('invalid_purchases');

  }



  var sheet = getSheet('Compras');



  ensurePurchaseHeaders(sheet);



  var lastRow = sheet.getLastRow();



  if (lastRow > 1) {

    sheet

      .getRange(2, 1, lastRow - 1, 6)

      .clearContent();

  }



  if (!purchases.length) {

    return;

  }



  var rows = purchases.map(function(purchase) {



    return [

      purchase.id || '',

      purchase.label || '',

      purchase.date || '',

      Number(purchase.credits) || 0,

      Number(purchase.cost) || 0,

      purchase.currency || ''

    ];

  });



  sheet

    .getRange(2, 1, rows.length, 6)

    .setValues(rows);

}





// ======================================================

// PROGRAMAS

// ======================================================



function ensureProgramHeaders(sheet) {



  sheet.getRange(1, 1, 1, 6).setValues([[

    'ID',

    'Nombre',

    'Descripcion',

    'MetaEpisodios',

    'Activo',

    'FechaCreacion'

  ]]);

}





function readProgramas() {



  var sheet = getSheet('Programas');



  ensureProgramHeaders(sheet);



  var lastRow = sheet.getLastRow();



  if (lastRow < 2) {

    return [];

  }



  var data =

    sheet

      .getRange(2, 1, lastRow - 1, 6)

      .getValues();



  return data



    .filter(function(row) {

      return row[0] !== '';

    })



    .map(function(row) {



      return {

        id: String(row[0]),

        name: String(row[1] || ''),

        description: String(row[2] || ''),

        target: Number(row[3]) || 0,

        active: row[4] !== false,

        createdAt: normalizeDate(row[5])

      };

    });

}





function validatePrograms(programs) {



  if (!Array.isArray(programs)) {

    throw new Error('invalid_programs');

  }



  var ids = {};



  programs.forEach(function(program) {



    if (

      !program ||

      typeof program !== 'object'

    ) {

      throw new Error('invalid_program');

    }



    var id =

      String(program.id || '').trim();



    var name =

      String(program.name || '').trim();



    var target =

      Number(program.target);



    if (!id) {

      throw new Error('program_id_required');

    }



    if (!name) {

      throw new Error('program_name_required');

    }



    if (ids[id]) {

      throw new Error('duplicate_program_id');

    }



    if (

      !Number.isFinite(target) ||

      target <= 0 ||

      Math.floor(target) !== target

    ) {

      throw new Error('invalid_program_target');

    }



    ids[id] = true;

  });

}





function writeProgramas(programs) {



  validatePrograms(programs);



  var sheet = getSheet('Programas');



  ensureProgramHeaders(sheet);



  var lastRow = sheet.getLastRow();



  if (lastRow > 1) {

    sheet

      .getRange(2, 1, lastRow - 1, 6)

      .clearContent();

  }



  if (!programs.length) {

    return;

  }



  var rows = programs.map(function(program) {



    return [

      String(program.id || '').trim(),

      String(program.name || '').trim(),

      String(program.description || '').trim(),

      Number(program.target),

      program.active !== false,

      program.createdAt || new Date()

    ];

  });



  sheet

    .getRange(2, 1, rows.length, 6)

    .setValues(rows);

}





// ======================================================

// CONFIGURACIÓN GLOBAL

// ======================================================



function ensureSettingsHeaders(sheet) {



  sheet.getRange(1, 1, 1, 2).setValues([[

    'MetaEpisodios',

    'CreditosIniciales'

  ]]);

}





function readConfiguracion() {



  var sheet = getSheet('Configuracion');



  if (sheet.getLastRow() < 2) {



    return {

      target: 40,

      initialUsed: 0

    };

  }



  var row =

    sheet

      .getRange(2, 1, 1, 2)

      .getValues()[0];



  return {

    // Se conserva temporalmente por compatibilidad

    // con el frontend actual.

    target:

      row[0] === '' ? 40 : Number(row[0]),



    initialUsed:

      row[1] === '' ? 0 : Number(row[1])

  };

}





function writeConfiguracion(settings) {



  if (

    !settings ||

    typeof settings !== 'object' ||

    Array.isArray(settings)

  ) {

    throw new Error('invalid_settings');

  }



  var sheet = getSheet('Configuracion');



  ensureSettingsHeaders(sheet);



  sheet

    .getRange(2, 1, 1, 2)

    .setValues([[

      Number(settings.target) || 0,

      Number(settings.initialUsed) || 0

    ]]);

}





// ======================================================

// LEER SEGÚN KEY

// ======================================================



function readByKey(key) {



  if (key === 'credit-entries') {

    return readGeneraciones();

  }



  if (key === 'credit-purchases') {

    return readCompras();

  }



  if (key === 'settings') {

    return readConfiguracion();

  }



  if (key === 'programs') {

    return readProgramas();

  }



  throw new Error('invalid_key');

}





// ======================================================

// ESCRIBIR SEGÚN KEY

// ======================================================



function writeByKey(key, value, role) {



  if (key === 'credit-entries') {

    writeGeneraciones(value);

    return;

  }



  if (key === 'credit-purchases') {

    writeCompras(value);

    return;

  }



  if (key === 'settings') {

    writeConfiguracion(value);

    return;

  }



  if (key === 'programs') {



    if (role !== 'admin') {

      throw new Error('admin_required');

    }



    writeProgramas(value);

    return;

  }



  throw new Error('invalid_key');

}





// ======================================================

// RESPALDO TEMPORAL EN DATA

// ======================================================



function backupToData(key, value) {



  var sheet = getSheet('Data');



  var data =

    sheet.getDataRange().getValues();



  var jsonValue =

    JSON.stringify(value);



  var found = false;



  for (var i = 0; i < data.length; i++) {



    if (data[i][0] === key) {



      sheet

        .getRange(i + 1, 2)

        .setValue(jsonValue);



      found = true;

      break;

    }

  }



  if (!found) {

    sheet.appendRow([

      key,

      jsonValue

    ]);

  }

}





// ======================================================

// AUDITORÍA

// ======================================================



function addAudit(action, key, role) {



  var auditSheet = getSheet('Audit');



  auditSheet.appendRow([

    new Date(),

    action,

    key,

    String(role || '').toUpperCase()

  ]);

}





// ======================================================

// GET

// Login + lectura de datos

// ======================================================



function doGet(e) {



  try {



    var password =

  e.parameter.password;



var action =

  e.parameter.action;





// --------------------------------------------------

// LISTA PÚBLICA DE PROGRAMAS ACTIVOS

// No expone información sensible

// --------------------------------------------------



if (action === 'public-programs') {



  var programs =

    readProgramas()

      .filter(function(program) {

        return program.active === true;

      })

      .map(function(program) {

        return {

          id: program.id,

          name: program.name

        };

      });



  return jsonResponse(programs);

}





// --------------------------------------------------

// AUTENTICACIÓN

// --------------------------------------------------



var role =

  checkPassword(password);



if (!role) {



  return jsonResponse({

    authorized: false,

    error: 'unauthorized'

  });

}





    // --------------------------------------------------

    // LOGIN

    // --------------------------------------------------



    if (action === 'login') {



      return jsonResponse({

        authorized: true,

        role: role

      });

    }





    // --------------------------------------------------

    // OBTENER DATOS

    // --------------------------------------------------



    var key =

      e.parameter.key;



    if (!key) {



      return jsonResponse({

        error: 'missing_key'

      });

    }



    if (!isAllowedKey(key)) {



      return jsonResponse({

        error: 'invalid_key'

      });

    }



    var result =

      readByKey(key);



    return jsonResponse(result);





  } catch (error) {



    return jsonResponse({

      error: 'server_error',

      message: error.message

    });

  }

}





// ======================================================

// POST

// ======================================================



function doPost(e) {



  var lock =

    LockService.getScriptLock();



  var lockAcquired = false;



  try {



    var body;



    try {



      body =

        JSON.parse(e.postData.contents);



    } catch (parseError) {



      return jsonResponse({

        ok: false,

        error: 'invalid_json'

      });

    }





    var password =

      body.password;



    var role =

      checkPassword(password);



    if (!role) {



      return jsonResponse({

        authorized: false,

        error: 'unauthorized'

      });

    }





    var action =

      body.action;





    // ==================================================

    // GUARDAR

    // ==================================================



    if (action === 'save') {



      var key =

        body.key;



      if (!isAllowedKey(key)) {



        return jsonResponse({

          ok: false,

          error: 'invalid_key'

        });

      }





      // Programas solo puede modificarlos ADMIN



      if (

        key === 'programs' &&

        role !== 'admin'

      ) {



        return jsonResponse({

          ok: false,

          authorized: false,

          error: 'admin_required'

        });

      }





      var parsedValue;



      try {



        parsedValue =

          JSON.parse(body.value);



      } catch (valueError) {



        return jsonResponse({

          ok: false,

          error: 'invalid_value_json'

        });

      }





      lock.waitLock(10000);

      lockAcquired = true;



      try {



        writeByKey(

          key,

          parsedValue,

          role

        );



        backupToData(

          key,

          parsedValue

        );



        if (key === 'programs') {

          addAudit(

            'SAVE_PROGRAMS',

            key,

            role

          );

        }



      } finally {



        if (lockAcquired) {

          lock.releaseLock();

          lockAcquired = false;

        }

      }





      return jsonResponse({

        ok: true

      });

    }





    // ==================================================

    // DELETE DE UNA KEY COMPLETA

    // SOLO ADMIN

    // ==================================================



    if (action === 'delete') {



      if (role !== 'admin') {



        return jsonResponse({

          authorized: false,

          error: 'admin_required'

        });

      }





      var deleteKey =

        body.key;



      if (!isAllowedKey(deleteKey)) {



        return jsonResponse({

          ok: false,

          error: 'invalid_key'

        });

      }





      lock.waitLock(10000);

      lockAcquired = true;



      var deleted = false;



      try {



        if (deleteKey === 'credit-entries') {



          writeGeneraciones([]);

          deleted = true;



        } else if (

          deleteKey === 'credit-purchases'

        ) {



          writeCompras([]);

          deleted = true;



        } else if (

          deleteKey === 'settings'

        ) {



          writeConfiguracion({

            target: 40,

            initialUsed: 0

          });



          deleted = true;



        } else if (

          deleteKey === 'programs'

        ) {



          // Por seguridad no permitimos borrar

          // todos los programas de una sola vez.



          return jsonResponse({

            ok: false,

            error: 'program_delete_not_allowed'

          });

        }





        // ----------------------------------------------

        // ELIMINAR RESPALDO DE DATA

        // ----------------------------------------------



        var deleteSheet =

          getSheet('Data');



        var deleteData =

          deleteSheet

            .getDataRange()

            .getValues();



        for (

          var j = deleteData.length - 1;

          j >= 0;

          j--

        ) {



          if (

            deleteData[j][0]

              === deleteKey

          ) {



            deleteSheet

              .deleteRow(j + 1);



            break;

          }

        }





        addAudit(

          'DELETE',

          deleteKey,

          role

        );





      } finally {



        if (lockAcquired) {

          lock.releaseLock();

          lockAcquired = false;

        }

      }





      return jsonResponse({

        ok: true,

        deleted: deleted

      });

    }





    // ==================================================

    // ACCIÓN DESCONOCIDA

    // ==================================================



    return jsonResponse({

      error: 'unknown_action'

    });





  } catch (error) {



    if (lockAcquired) {



      try {

        lock.releaseLock();

      } catch (\_) {}



    }



    return jsonResponse({

      ok: false,

      error: 'server_error',

      message: error.message

    });

  }

}