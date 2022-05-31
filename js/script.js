

let circleColors = ['primary','secondary','success','danger','warning','info'];
let data = [];
let departmentdb = [];
let locationdb =[];


$(document).ready(function () {
	$("#loader").fadeOut("slow");
	getEmployees();
	getDepartments();
	getLocations() ;
  });

  $('#search').change(function() {
	getEmployeeByName();
  });

  $('#departmentsel').change(function(){
	filterEmployeesByDepartment();
  })
  
  $('#locationsel').change(function(){
	filterEmployeesByLocation();
  }) 
  


  $('#reset').click(
    function(){
    getEmployees();
    $('#departmentsel').val('placeholder'); 
    $('#locationsel').val('placeholder'); 
    $('#search').val('');
    }
);

$('#saveLoc').click(
	function(){
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
	}
  );

  $('#saveDep').click(
	function(){
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
	}
  );
  
  $('#saveEmployee').click(
	function(){
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
	return Math.floor((Math.random()*circleColors.length));
  }

  //Error display
function showErrorModal(errortext){
	$('#errorFooter').html('');
	let button =`<button class="confirmBtn btn" data-bs-dismiss="modal" role="button" aria-expanded="false" aria-controls="error"  id='notificationBtn'>Ok</button>`
	$('#errorBody').html(errortext);
	$('#errorFooter').append(button);
	$('#errorModal').modal('show');
	}
  

function   getEmployees(){


	$.ajax({
		url: "php/getAll.php",
		type: 'POST',
		dataType: 'json',
		data: {		},
		success: function(result) {	
			$('#records-card-list').html('');		
			$('#countPersonnel').html('');		    
               data = result.data;
			   $('#countPersonnel').html(data.length);
			 

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
				  updateEmployeeClick(id)
				  deleteEmployeeClick(id);
				
			  }  

			 					
		},
		error: function(jqXHR, textStatus, errorThrown) {
          
		}
	}); 
}


function createEmployeeCard(id, first_name, last_name, email, department, job, location, span_avatr){  
	let new_card = `
				  <div id="${id}" class=" list-item list-item-action mb-3" data-toggle="list" role="tab">
                  <div class="row">
                  <div class="col-3 avatar avatar-text rounded-3 px-1 me-2 mb-2  bg-${circleColors[random_color(circleColors)]}">${span_avatr}</div>
				  <div class="col-9 mt-2 " style=" font-weight: bold;">${last_name + " " + first_name}
				  <button type="button" class="btn btn-sm btn-outline-success mx-1" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" id="edit${id}" value="${id}"><img src="css/images/pencil.svg"></button>
				  <button type="button" class="btn btn-sm btn-outline-danger mx-0" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" id="del${id}" value="${id}"><img src="css/images/trash.svg"></button>
				  </div>
				  <div class="row">
				  <a  href="mailto:${email}" class="col-sm-2 col-md-3  mb-1 ms-5" style="color:navy; font-family:Arial; "><i class="fa-solid fa-envelope"></i>${email}</a>
				  
				  <div class="col-sm-2 col-md-3 badge rounded-pill bg-danger mb-1" >${job}</div>
                  <div class="col-sm-2 col-md-3 badge rounded-pill bg-info mb-1" ><i class="fa-solid fa-user-pen"></i>${department}</div>
                  <div class="col-sm-2 col-md-2 badge rounded-pill bg-success "><i class="fa-solid fa-location-dot"></i>${location}</div>
				  </div>
                  </div>
                
				  `
  return new_card
   };

   


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
          getDropdowns($('#deleteDepSel'), departmentdb, placeholder);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + textStatus+ errorThrown );
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

  function getEmployeeByName(){
	$.ajax({
	  url: "php/getEmployeeByName.php",
	  type: 'POST',
	  dataType: 'json', 
	  data:{
		firstName : $('#search').val(),
		lastName: $('#search').val()
	  },
	  success: function(result) {
		$('#records-card-list').html('');
		   let employeeMatch = result.data;
			for (let j=0; j<employeeMatch.length; j++){
			  for(let i=0; i<data.length; i++){
			  if (data[i].firstName == employeeMatch[j].firstName || data[i].lastName == employeeMatch[j].lastName){
			  let id= data[i].id;
			  let first_name = data[i].firstName;
			  let last_name= data[i].lastName;
			  let email = data[i].email;
			  let department = data[i].department;
			  let job = data[i].jobTitle;
			  let location = data[i].location;
			  let first_letterF = data[i].firstName.charAt(0);
			  let first_letterL =  data[i].lastName.charAt(0);
			  let span_avatr = first_letterL + first_letterF;
			  let new_card = createEmployeeCard(id, first_name, last_name, email, department, job, location, span_avatr);
				  $('#records-card-list').append(new_card);
				  updateEmployeeClick(id);
				  deleteEmployeeClick(id);
			  }
			  }
			}
	  },
	  error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR + textStatus+ errorThrown )
	  }
	}); 
   
   }

   // filter database
 
 function filterEmployeesByDepartment(){
		$('#records-card-list').html('');
	let location ='';
	for (let i= 0; i< data.length; i++){
		
	  let department = data[i].department;
	  if (department ==$('#departmentsel option:selected').text()){
	  let id = data[i].id;
	  let first_name = data[i].firstName;
	  let last_name= data[i].lastName;
	  let email = data[i].email;
	  let job = data[i].jobTitle;
	  location = data[i].location;
	  let first_letterF = data[i].firstName.charAt(0);
	let first_letterL =  data[i].lastName.charAt(0);
	let span_avatr = first_letterL + first_letterF;
	  let new_card = createEmployeeCard(id, first_name, last_name, email, department, job, location, span_avatr);
				  $('#records-card-list').append(new_card);
				  updateEmployeeClick(id);
				  deleteEmployeeClick(id);
	  }
	  }
	for (let j=0; j<locationdb.length; j++) {
	  if (location == locationdb[j].name){
		let locationID = locationdb[j].id
		$('#locationsel').val(locationID); 
	  }
	}
}

function filterEmployeesByLocation(){
	$('#records-card-list').html('');
	for (let i= 0; i< data.length; i++){
	  let location = data[i].location;
	  if (location ==$('#locationsel option:selected').text()){
	  let id = data[i].id;
	  let first_name = data[i].firstName;
	  let last_name= data[i].lastName;
	  let email = data[i].email;
	  let department = data[i].department;
	  let job = data[i].jobTitle;
	  let first_letterF = data[i].firstName.charAt(0);
	  let first_letterL =  data[i].lastName.charAt(0);
	  let span_avatr = first_letterL + first_letterF;
		let new_card = createEmployeeCard(id, first_name, last_name, email, department, job, location, span_avatr);
					$('#records-card-list').append(new_card);
					updateEmployeeClick(id);
					deleteEmployeeClick(id);

	  }
	}
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
		   getLocations();
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
		   getDepartments();
		  
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


   function updateEmployeeClick(id) {
	$(`#edit${id}`).on('click', function() {
		appendUpdateForm(id);
		confirmUpdateEmployee(id);

	});


}
  
function appendUpdateForm(id){
  $('#editEmployeeModal').html('');
  for (let i= 0; i< data.length; i++){
    let employeeID = data[i].id;
    if (employeeID == id){
    let firstName = data[i].firstName;
    let lastName= data[i].lastName;
    let job = data[i].jobTitle;
    let email = data[i].email;
    let department = data[i].department;
    let updateForm = createUpdateForm(firstName, lastName, job, email);
    $('#editEmployeeModal').append(updateForm);
    getDropdowns($('#updateDepSelect'), departmentdb);
    for(let i=0; i<departmentdb.length; i++){
      if(department == departmentdb[i].name){
        $("#updateDepSelect").val(departmentdb[i].id);
        break; 
      } 
    }
    }
  }
}

  function createUpdateForm(fName, lName, job, mail){
   let form = `
   <div class="modal-dialog" role="document">
     <div class="modal-content">
       <div class="modal-header" id="personnelHeader">
         <h6 class="modal-title">Update Employee</h6>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
         </button>
       </div>
       <div class="modal-body">
           <form>
               <div class="form-group">
                 <label for="FirstName">First Name</label>
                 <input class="form-control" id="FirstName" value="${fName}"></input>
               </div>
               <div class="form-group">
                   <label for="LastName">Last Name</label>
                   <input class="form-control" id="LastName" value="${lName}"></input>
                 </div>
                 <div class="form-group">
                   <label for="JobTitle">Job Title</label>
                   <input class="form-control" id="JobTitle" value="${job}"></input>
                 </div>
                 <div class="form-group">
                   <label for="Email">Email</label>
                   <input class="form-control" id="Email" value="${mail}"></input>
                 </div>
               <div class="form-group">
                   <label for="updateDepSelect">Department</label>
                   <select class="form-control" id="updateDepSelect">
                   </select>
                 </div>
             </form>
       </div>
       <div class="modal-footer">
         <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
         <button class="confirmBtn btn" id='updateEmployeeConfirmBtn'>Save</button>
       </div>
     </div>
   </div>` 
 return form;
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
	$('#updateEmployeeConfirmBtn').click(
	function(){
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

  function deleteEmployeeClick(id){
	$('#del'+id).click(
	  function(){
		confirmDeleteEmployee(id);
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
		   getDepartments();
		   
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
		   getLocations();
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
  