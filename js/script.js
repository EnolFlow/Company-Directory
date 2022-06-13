

let circleColors = ['primary','secondary','success','warning','info','light'];

$(document).ready(function () {

	 main()
  });

function main(){
  getEmployees();
  getDepartments();
  getLocations() ; 
}
$('#search').keyup(function() {
let searchTerm = $('#search').val();
let department = $('#departmentsel ').val();
let loc = $('#locationsel ').val();
  getEmployeeByName(searchTerm,department,loc);
});

$('#departmentsel').change(function() {
  let searchTerm = $('#search').val();
  let department = $('#departmentsel ').val();
  let loc = $('#locationsel ').val();
   getEmployeeByName(searchTerm,department,loc);
  });

$('#locationsel').change(function() {
  let searchTerm = $('#search').val();
  let department = $('#departmentsel ').val();
  let loc = $('#locationsel ').val();
      getEmployeeByName(searchTerm,department,loc);
});
 

$('#employees-btn').click(
  function(){
  getEmployees();
  }
);

$('#departments-btn').click(
  function(){
  buildDepartments();
  }
);
$('#locations-btn').click(
  function(){
  buildLocations();
  }
);

let departmentdb = [];
let locationdb = [];

$('#reset').click(
  function(){
  $('#departmentsel').val('placeholder'); 
  $('#locationsel').val('placeholder'); 
  $('#search').val('');
  getEmployees();
  }
);



$('#saveLoc').on('submit', function(e) {

  e.preventDefault();
  e.stopPropagation();
  $.ajax({
      url: "php/getAllLocations.php",
      type: 'POST',
      dataType: 'json', 
      success: function(result) {
         let   locationdb= result.data
      function alreadyRegistered(){
        let exist; 
        for (let i=0; i<locationdb.length; i++){
          if (locationdb[i].name == $('#newLoc').val()){
           exist=true;
           break;
          } else {
            exist=false;
          }
          }
          return exist
        }
      let registered = alreadyRegistered();
      let length = checkLength($('#newLoc').val());
      let incorrectCharacters= validateInput($('#newLoc').val())
      if(registered){
        showErrorModal('This location exists already.')
      } else if (!length){
        showErrorModal("Valid Input for new location is between 2 and 50 characters."); 
      } else if (incorrectCharacters){
        showErrorModal('Invalid characters. Please only use letters and white spaces.'); 
      }
      else {
        addNewLocation();
        $('#addLocModal').modal('hide');
        $('#newLoc').val('');
      }
    
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + textStatus+ errorThrown )
      }
    })  
  }
);

$('#saveDep').on('submit', function(e) {

  e.preventDefault();
  e.stopPropagation();
  $.ajax({
      url: "php/getAllDepartments.php",
      type: 'GET',
      dataType: 'json', 
      success: function(result) {
         let departmentdb = result.data;
         
             function alreadyRegistered(){
        let exist; 
        for (let i=0; i<departmentdb.length; i++){
          if (departmentdb[i].name == $('#newDep').val()){
           exist=true;
           break;
          } else {
            exist=false;
          }
          }
          return exist
        }
      let registered = alreadyRegistered();
      let lengthChecked = checkLength($('#newDep').val());
      let incorrectCharacters= validateInput($('#newDep').val());
      if(registered){
        showErrorModal ('This department exists already.');
      } else if(!lengthChecked) {
        showErrorModal("Valid Input for new department is between 2 and 50 characters."); 
      } else if(incorrectCharacters) {
        showErrorModal('Invalid characters. Please only use letters and white spaces.'); 
      }else if (!$('#locDepSelect').val()){
        showErrorModal('Choose a location.');
      } else {
        addNewDepartment();
        $('#addDepModal').modal('hide');
        $('#newDep').val('');
      }

        
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + textStatus+ errorThrown );
      }
    })
  }  
);

$('#saveEmployee').on('submit', function(e) {

  e.preventDefault();
  e.stopPropagation();
  
      $.ajax({
          url: "php/getAll.php",
          type: 'POST',
          dataType: 'json',
          data: {		},
          success: function(result) {
              let data = result.data;
              let email = $('#newEmail').val()
              let fName = $('#newFirstName').val();
              let lName = $('#newLastName').val();
              let job = $('#newJob').val();
              function alreadyRegistered(){
                let exist; 
                for (let i=0; i<data.length; i++){
                  if ((data[i].firstName == fName && data[i].lastName == lName)||data[i].email == email){
                   exist=true;
                   break;
                  } else {
                    exist=false;
                  }
                  }
                  return exist
                }
              let registered = alreadyRegistered();
              let valid = validateEmployeeEntry('employeeDepSelect', email, fName, lName, job);
              if(registered){
                showErrorModal('An employee with these details is already registered in the database.');
              } else if (valid){
                addNewEmployee();
                $('#addEmployeeModal').modal('hide')
              }
                   
              },
              error: function(jqXHR, textStatus, errorThrown) {}
          }); 
      }     
);

$('#deleteDepBtn').click(
  function(){
    checkDeleteDep($('#deleteDepSel').val())
    .then((dependent) => {
      if (dependent){
       showErrorModal('Employee entries dependent on this deparment. Deletion not possible.')
     } else {
     deleteDepartment();
	 buildDepartments();
     $('#deleteDepModal').modal('hide');
     }
    })
    .catch((error)=> {
     console.log(error)
    })
}
);

$('#deleteLocBtn').click(
 function(){
 checkDeleteLoc($('#deleteLocSel').val())
 .then((dependent)=>{
   if (dependent){
   showErrorModal('Department entries dependent on this location. Deletion not possible.')
 } else {
  deleteLocation();
  buildLocations();
  $('#deleteLocModal').modal('hide');
 }
})
 
}
);

  

function getDropdowns(htmlID, db, placeholder){
  htmlID.html('');
  let selectph = `<option disabled hidden selected value="placeholder">${placeholder}</option>`;
  htmlID.append(selectph);
  for(let i= 0; i<db.length; i++){
    htmlID.append($("<option>", {
                value: db[i].id,
                text: db[i].name
            })); 
          } 
}

function checkLength(input){
  if (input.length < 2 || input.length > 50){
    return false;
  } else {
  return true;
  }
}

function validateInput(input){
  var reg= /^[a-zA-Z\. ]*$/
if(reg.test(input)){              
return false;
}               
return true;
}

function validateEmail(email) {
  const reexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (reexp.test(email) == false){
  return false
  } else {
  return true
}
}

function validateEmployeeEntry(selectMenue, email, fName, lName, job){

  let validatedEmail =validateEmail(email);
  let incorrectFirstName = validateInput(fName);
  let incorrectLastName = validateInput(lName)
  let incorrectJob = validateInput(job);
  let lengthFirstName = checkLength(fName);
  let lengthLastName = checkLength(lName);
  if (!validatedEmail){
    showErrorModal('Please enter a valid email address.')
  } else if(!$(`#${selectMenue}`).val()){
     showErrorModal('Choose a department.');
   } else if(incorrectFirstName|| incorrectLastName|| incorrectJob){
     showErrorModal('Invalid characters. Please only use letters and white spaces.');
   } else if(!lengthFirstName || !lengthLastName){
     showErrorModal('Valid input for names between 2 and 50 characters.');
   } else {
       return true;
     }
}


function random_color (circleColors) {
    const color = Math.floor((Math.random()*circleColors.length));
  return color
}

//Error display
function showErrorModal(errortext){
  $('#errorFooter').html('');
  let button =`<button class=" btn" data-bs-dismiss="modal" role="button" aria-expanded="false" aria-controls="error"  id='notificationBtn'>Ok</button>`
  $('#errorBody').html(errortext);
  $('#errorFooter').append(button);
  $('#errorModal').modal('show');
  }


function   getEmployees(){
getDepartments();
getLocations();

  $.ajax({
      url: "php/getAll.php",
      type: 'POST',
      dataType: 'json',
      data: {		},
      success: function(result) {
          $('#selLoc').hide();
          $('#selDep').hide();	
          $('#addEmployeebtn').show();	
          $('#modals').show();
          $('#filters').show();	
          $('#records-card-list').html('');		
          $('#count').html('');
          $('#insertIcon').html('');
            let data = result.data;

             $('#count').html(data.length);
             $('#insertIcon').html('<i class="fa-solid fa-people-group"></i>');

            for (let i = 0; i < data.length; i++) {
                let department = data[i].department;
              let location = data[i].location
              let first_name = data[i].firstName;
                let last_name = data[i].lastName;
                let first_letterF = data[i].firstName.charAt(0);
                let first_letterL =  data[i].lastName.charAt(0);
                let span_avatr = first_letterL + first_letterF;
                let email = data[i].email;
               let id = data[i].id;
              let job = data[i].jobTitle;
                let new_card = createEmployeeCard(id, first_name, last_name, email, department, job, location, span_avatr);
                $('#records-card-list').append(new_card);
                
                
            }  
            updateEmployeeClick()
            deleteEmployeeClick();
                               
      },
      error: function(jqXHR, textStatus, errorThrown) {
        
      }
  }); 
}


function createEmployeeCard(id, first_name, last_name, email, department, job, location, span_avatr){  
  let new_card = `

  <tr id="${id}">
  <td class=" avatar avatar-text rounded-3   bg-${circleColors[random_color(circleColors)]}">${span_avatr}</td>
  <td>${last_name + ", "+ first_name}</td>
  <td class="hidden"><a  href="mailto:${email}" class=" style="color:navy; font-family:Arial; "><i class="fa-solid fa-envelope"></i>${email}</a>
  </td>
  <td class="hidden">${department}</td>
  <td class="hidden">${location}</td>
  <td class="hidden">${job}</td>
  <td><button type="button" class=" editEmployee btn btn-sm btn-success " data-bs-toggle="modal" data-bs-target="#editEmployeeModal" ><img src="css/images/pencil.svg"></button></td>
  <td> <button type="button" class="delEmployee btn btn-sm btn-danger " data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" ><img src="css/images/trash.svg"></button>
  </td>

              
                `
return new_card
 };

 function buildDepartments() { 
  $.ajax({
    url: "php/getAllDepartments.php",
    type: 'GET',
    dataType: 'json', 
    success: function(result) {
      let departmentdb = result.data;
      $('#selLoc').hide();
      $('#addEmployeebtn').hide();
      $('#selDep').show();	
      $('#modals').hide();	
      $('#filters').hide();		
      $('#records-card-list').html('');		
      $('#count').html('');
      $('#insertIcon').html('');
        $('#count').html(departmentdb.length);
        $('#insertIcon').html('<i class="fa-solid fa-user-pen"></i>');
       
        for (let i = 0; i < departmentdb.length; i++) {
            
          let department = departmentdb[i].name;
            let first_letterF = departmentdb[i].name.charAt(0);
            let span_avatr =  first_letterF;
            let id = departmentdb[i].id
           let departments = `

  <tr id="${id}">
  <td class=" avatar avatar-text rounded-3   bg-${circleColors[random_color(circleColors)]}">${span_avatr}</td>
  <td >${department}</td>
  <td style="text-align:end;"><button type="button" class=" editDep btn btn-sm btn-success me-3 " data-bs-toggle="modal" data-bs-target="#editDepartmentModal"><img src="css/images/pencil.svg"></button>
 <button type="button" class="delDep btn btn-sm btn-danger " data-bs-toggle="modal" data-bs-target="#deleteDepModal"><img src="css/images/trash.svg"></button>
  </td>
  </tr>
                `
                $('#records-card-list').append(departments);
            
      }
      updateDepartmentClick()
	  deleteDepartmentClick();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown );
    }
  }); 
  
}

 


 function getDepartments() { 
  $.ajax({
    url: "php/getAllDepartments.php",
    type: 'GET',
    dataType: 'json', 
    success: function(result) {
        departmentdb = result.data;
        let placeholder='Select Department'
        getDropdowns($('#departmentsel'), departmentdb, placeholder);
        getDropdowns($('#employeeDepSelect'), departmentdb, placeholder);
        
        
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown );
    }
  }); 
  
}

function buildLocations()  {
  $.ajax({
    url: "php/getAllLocations.php",
    type: 'GET',
    dataType: 'json', 
    success: function(result) {
        let  locationdb= result.data;
          $('#addEmployeebtn').hide();
          $('#selDep').hide();
          $('#selLoc').show();		
          $('#modals').hide();	
          $('#filters').hide();		
          $('#records-card-list').html('');		
          $('#count').html('');
          $('#insertIcon').html('');
            $('#count').html(locationdb.length);
            $('#insertIcon').html('<i class="fa-solid fa-location-dot"></i>');
            for (let i = 0; i < locationdb.length; i++) {
              let location = locationdb[i].name;
                let first_letterF = locationdb[i].name.charAt(0);
                let span_avatr =  first_letterF;
				let id = locationdb[i].id
               let locations = `
  
      <tr id="${id}">
      <td class=" avatar avatar-text rounded-3   bg-${circleColors[random_color(circleColors)]}">${span_avatr}</td>
      <td >${location}</td>
	  <td style="text-align:end;"><button type="button" class=" editLoc btn btn-sm btn-success me-3 " data-bs-toggle="modal" data-bs-target="#editLocationModal"><img src="css/images/pencil.svg"></button>
  <button type="button" class="delLoc btn btn-sm btn-danger " data-bs-toggle="modal" data-bs-target="#deleteLocModal"><img src="css/images/trash.svg"></button>
  </td>
      </tr>
  
                  
                    `
                    $('#records-card-list').append(locations);
                
          }
		  updateLocationClick()
		  deleteLocationClick();

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  });   
}

function getLocations()  {
  $.ajax({
    url: "php/getAllLocations.php",
    type: 'GET',
    dataType: 'json', 
    success: function(result) {
          locationdb= result.data
          let placeholder = 'Select Location'
          getDropdowns($('#locationsel'), locationdb, placeholder);
          getDropdowns($('#locDepSelect'), locationdb, placeholder);
          getDropdowns($('#deleteLocSel'), locationdb, placeholder);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  });   
}



function addNewLocation() {
  $.ajax({
    url: "php/insertLocation.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      name : $('#newLoc').val(),
    },
    success: function(result) {
         console.log(result);
         buildLocations();
         $('#newLoc').val('');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  }); 
 }

 function addNewDepartment() {
  $.ajax({
    url: "php/insertDepartment.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      name : $('#newDep').val(),
      locationID: $('#locDepSelect').val()
    },
    success: function(result) {
      $('#newDep').val('');
      $('#locDepSelect').val('placeholder');
         console.log(result);
         buildDepartments();
        
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  });  
 }
 
 function addNewEmployee() {
  $.ajax({
    url: "php/insertEmployee.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      firstName : $('#newFirstName').val(),
      lastName: $('#newLastName').val(),
      jobTitle: $('#newJobTitle').val(),
      email: $('#newEmail').val(),
      departmentID: $('#employeeDepSelect').val()
    },
    success: function(result) {
         console.log(result);
         getEmployees();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  });  
 }


 

function UpdateForm(id){
  $.ajax({
      url: "php/getPersonnelByID.php",
      type: 'POST',
      dataType: 'json',
      data: {	id: id	},
      success: function(result) {
          let data = result.data.personnel[0];
          let firstName = data.firstName;
          let lastName= data.lastName;
          let job = data.jobTitle;
          let email = data.email;
          $('#FirstName').val(firstName),
          $('#LastName').val(lastName),
          $('#JobTitle').val(job),
          $('#Email').val(email),
            getDropdowns($('#updateDepSelect'), departmentdb);
            $("#updateDepSelect").val(data.departmentID);
      
          },
          error: function(jqXHR, textStatus, errorThrown) {}
      }); 

}


  

function updateEmployee(id) {
  $.ajax({
   url: "php/updateEmployee.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     id: id,
     firstName : $('#FirstName').val(),
     lastName: $('#LastName').val(),
     jobTitle: $('#JobTitle').val(),
     email: $('#Email').val(),
     departmentID: $('#updateDepSelect').val()
   },
   success: function(result) {
        console.log(result);
        getEmployees();
        $('#FirstName').val(''),
        $('#LastName').val(''),
        $('#JobTitle').val(''),
        $('#Email').val(''),
        $('#updateDepSelect').val('')
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 });
}

  
function confirmUpdateEmployee(id){
  $('#updateEmployeeConfirmBtn').on('submit', function(e) {

      e.preventDefault();
      e.stopPropagation();
      let email = $('#Email').val()
      let fName = $('#FirstName').val();
      let lName = $('#LastName').val();
      let job = $('#Job').val();
      let valid = validateEmployeeEntry('updateDepSelect', email, fName, lName, job);
      if (valid){
        updateEmployee(id);
        $('#editEmployeeModal').modal('hide')
      }
  }
)
}

function updateEmployeeClick() {
  $(`.editEmployee`).on('click', function() {
      let id = $(this).closest('tr').attr('id')
      UpdateForm(id);
      confirmUpdateEmployee(id);

  });
}

function UpdateFormDep(id){
  $.ajax({
      url: "php/getDepartment.php",
      type: 'POST',
      dataType: 'json',
      data: {	id: id	},
      success: function(result) {
          let nameDep = result.data.department[0];
          $('#nameDep').val(nameDep.name);
          getDropdowns($('#updateLocSelect'), locationdb);
          $("#updateLocSelect").val(nameDep.locationID);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR, textStatus, errorThrown)
          }
      }); 

}

function updateDepartment(id) {
  $.ajax({
   url: "php/updateDepartment.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     id: id,
     name : $('#nameDep').val(),
     locationID : $("#updateLocSelect").val(),
   },
   success: function(result) {
        console.log(result);
        buildDepartments();
        $('#nameDep').val('')
        $("#updateLocSelect").val('')
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 });
}

  
function confirmUpdateDepartment(id){
  $('#updateDepartmentConfirmBtn').on('submit', function(e) {

      e.preventDefault();
      e.stopPropagation();
      updateDepartment(id);
        $('#editDepartmentModal').modal('hide')
      
  }
)
}

function updateDepartmentClick() {
  $(`.editDep`).on('click', function() {
      let id = $(this).closest('tr').attr('id')
      UpdateFormDep(id);
      confirmUpdateDepartment(id);

  });
}

function deleteDepartmentClick(){
	$('.delDep').click(
	  function(){
		let id = $(this).closest('tr').attr('id');
		$.ajax({
			url: "php/getDepartment.php",
			type: 'POST',
			dataType: 'json', 
			data:{
			  id: id
			},
			success: function(result) {
				let data = result.data.department[0];
			let depname = data.name;
			$('#deleteDepSel').html( " " + depname) 
			$('#deleteDepSel').val(data.id) 

				 
			},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(jqXHR + textStatus+ errorThrown )
			}
		  });  
	  }
	);
  } 

  function UpdateFormLoc(id){
	$.ajax({
		url: "php/getLocation.php",
		type: 'POST',
		dataType: 'json',
		data: {	id: id	},
		success: function(result) {
		
			let nameLoc = result.data.location[0];
			$('#nameLoc').val(nameLoc.name);
			console.log(id,$('#nameLoc').val())
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
			}
		}); 
  
  }
  
  function updateLocation(id) {
	  console.log(id,$('#nameLoc').val())
	$.ajax({
	 url: "php/updateLocation.php",
	 type: 'POST',
	 dataType: 'json', 
	 data:{
	   id: id,
	   name : $('#nameLoc').val(),
	  
	 },
	 success: function(result) {
		  console.log(result);
		  buildLocations();
		  $('#nameLoc').val('')
	 },
	 error: function(jqXHR, textStatus, errorThrown) {
	   console.log(jqXHR + textStatus+ errorThrown )
	 }
   });
  }
  
	
  function confirmUpdateLocation(id){
	$('#updateLocationConfirmBtn').on('submit', function(e) {
  
		e.preventDefault();
		e.stopPropagation();
		updateLocation(id);
		  $('#editLocationModal').modal('hide')
		
	}
  )
  }
  
  function updateLocationClick() {
	$(`.editLoc`).on('click', function() {
		let id = $(this).closest('tr').attr('id')
		console.log(id)
		UpdateFormLoc(id);
		confirmUpdateLocation(id);
  
	});
  }
  
  function deleteLocationClick(){
	  $('.delLoc').click(
		function(){
		  let id = $(this).closest('tr').attr('id');
		  $.ajax({
			  url: "php/getLocation.php",
			  type: 'POST',
			  dataType: 'json', 
			  data:{
				id: id
			  },
			  success: function(result) {
				  let data = result.data.location[0];
			  let locname = data.name;
			  $('#deleteLocSel').html( " " + locname) 
			  $('#deleteLocSel').val(data.id) 
  
				   
			  },
			  error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR + textStatus+ errorThrown )
			  }
			});  
		}
	  );
	} 


function deleteEmployeeClick(){
  $('.delEmployee').click(
    function(){
      let id = $(this).closest('tr').attr('id');
      $.ajax({
          url: "php/getPersonnelByID.php",
          type: 'POST',
          dataType: 'json', 
          data:{
            id: id
          },
          success: function(result) {
              let data = result.data.personnel[0];
          let firstName = data.firstName;
          let lastName= data.lastName;
          $('#spanEmployeeDel').html(firstName + " " + lastName) 
          confirmDeleteEmployee(id);
               
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + textStatus+ errorThrown )
          }
        });  
    }
  );
} 

function confirmDeleteEmployee(id){
  $('#deleteEmployeeConfirmBtn').click(
  function(){

    deleteEmployee(id);
    $('#deleteEmployeeModal').modal('hide');

  }
)
}

function deleteDepartment() {
  $.ajax({
    url: "php/deleteDepartmentByID.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      id: $('#deleteDepSel').val()
    },
    success: function(result) {
         console.log(result);
         buildDepartments();
     
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  });  
 }
 
 function deleteLocation() {
  $.ajax({
    url: "php/deleteLocation.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      id: $('#deleteLocSel').val()
    },
    success: function(result) {
         console.log(result);
         buildLocations();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  });  
 }
 
 function deleteEmployee(id) {
   console.log(id);
   $.ajax({
    url: "php/deleteEmployee.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      id: id
    },
    success: function(result) {
         console.log(result);
         getEmployees();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  }); 
 }

 //check for dependent entries

function checkDeleteDep(depID){
  return new Promise((resolve, reject) => {
  $.ajax({
    url: "php/getDepartmentByID.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      departmentID : depID
    },
    success: function(result) {
        let dependencies;
        console.log(result.data)
        let count = result.data[0]['count(id)']
        if (count >0){
          dependencies = true;
        } else {
          dependencies = false
        }
        resolve(dependencies);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
      reject(error)
    }
  }); 
})
}

function checkDeleteLoc(locID){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/getLocationByID.php",
      type: 'POST',
      dataType: 'json', 
      data:{
        locationID : locID
      },
      success: function(result) {
        console.log(result);
          let dependencies;
          let count = result.data[0]['count(id)']
          if (count >0){
            dependencies = true;
          } else {
            dependencies = false
          }
          resolve(dependencies);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + textStatus+ errorThrown )
        reject(error)
      }
    }); 
  })
}

function getEmployeeByName(searchTerm,dep,loc){
  $.ajax({
    url: "php/searchBoth.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      searchTerm : searchTerm,
      department : dep,
     location : loc,

    },
    success: function(result) {
      $('#records-card-list').html('');		
      $('#count').html('');
      $('#insertIcon').html('');
        let data = result.data.personnel;
      console.log(data)
         $('#count').html(data.length);
         $('#insertIcon').html('<i class="fa-solid fa-people-group"></i>');
         for (let i = 0; i < data.length; i++) {
          let department = data[i].department;
        let location = data[i].location
        let first_name = data[i].firstName;
          let last_name = data[i].lastName;
          let first_letterF = data[i].firstName.charAt(0);
          let first_letterL =  data[i].lastName.charAt(0);
          let span_avatr = first_letterL + first_letterF;
          let email = data[i].email;
         let id = data[i].id;
        let job = data[i].jobTitle;
          let new_card = createEmployeeCard(id, first_name, last_name, email, department, job, location, span_avatr);
          $('#records-card-list').append(new_card);
          
          
          
      }
      updateEmployeeClick()  
      deleteEmployeeClick();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  }); 
 
 }


 
