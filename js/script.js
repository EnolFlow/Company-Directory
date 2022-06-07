

let circleColors = ['primary','secondary','success','warning','info','light'];



  function main(){
	getEmployees();
	getDepartments();
	getLocations() ; 
  }

  
  $('#employee-search').on('click',function() {    
	searchEmployee();

  });

  $('#searchModals').click(
    function(){
    $('#departmentsel').val('placeholder'); 
    $('#locationsel').val('placeholder'); 
    $('#name').val('');
    }
);

   
  
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
  $('#reset').click(
    function(){
    $('#departmentsel').val('placeholder'); 
    $('#locationsel').val('placeholder'); 
    $('#name').val('');
    }
);

 

$('#saveLoc').click(
	function(){
	$.ajax({
		url: "php/getAllLocations.php",
		type: 'GET',
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

  $('#saveDep').click(
	  function(){
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
  
  $('#saveEmployee').click(
	function(){
	
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
	  const color = Math.floor((Math.random()*circleColors.length));
	return color
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
			$('#addEmployeebtn').show();	
		    $('#modals').show();
			$('#searchModals').show();	
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

	<tr>
	<td class=" avatar avatar-text rounded-3   bg-${circleColors[random_color(circleColors)]}">${span_avatr}</td>
	<td>${last_name + " " + first_name}</td>
	<td class="hidden"><a  href="mailto:${email}" class=" style="color:navy; font-family:Arial; "><i class="fa-solid fa-envelope"></i>${email}</a>
	</td>
	<td class="hidden">${department}</td>
	<td class="hidden">${location}</td>
	<td class="hidden">${job}</td>
	<td><button type="button" class="btn btn-sm btn-success " data-bs-toggle="modal" data-bs-target="#editEmployeeModal" id="edit${id}" value="${id}"><img src="css/images/pencil.svg"></button></td>
	<td> <button type="button" class="btn btn-sm btn-danger " data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" id="del${id}" value="${id}"><img src="css/images/trash.svg"></button>
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
		$('#addEmployeebtn').hide();	
		$('#modals').hide();	
		$('#searchModals').hide();		
		$('#records-card-list').html('');		
		$('#count').html('');
		$('#insertIcon').html('');
		  $('#count').html(departmentdb.length);
		  $('#insertIcon').html('<i class="fa-solid fa-user-pen"></i>');
         
		  for (let i = 0; i < departmentdb.length; i++) {
			let department = departmentdb[i].name;
			  let first_letterF = departmentdb[i].name.charAt(0);
			  let span_avatr =  first_letterF;
			
			 let departments = `

	<tr>
	<td class=" avatar avatar-text rounded-3   bg-${circleColors[random_color(circleColors)]}">${span_avatr}</td>
	<td >${department}</td>
	</tr>

                
				  `
				  $('#records-card-list').append(departments);
			  
		}
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
          getDropdowns($('#deleteDepSel'), departmentdb, placeholder);
		  
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
			$('#modals').hide();	
			$('#searchModals').hide();		
			$('#records-card-list').html('');		
			$('#count').html('');
			$('#insertIcon').html('');
			  $('#count').html(locationdb.length);
			  $('#insertIcon').html('<i class="fa-solid fa-location-dot"></i>');
			  for (let i = 0; i < locationdb.length; i++) {
				let location = locationdb[i].name;
				  let first_letterF = locationdb[i].name.charAt(0);
				  let span_avatr =  first_letterF;
				
				 let locations = `
	
		<tr>
		<td class=" avatar avatar-text rounded-3   bg-${circleColors[random_color(circleColors)]}">${span_avatr}</td>
		<td >${location}</td>
		</tr>
	
					
					  `
					  $('#records-card-list').append(locations);
				  
			}


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
         let   locationdb= result.data
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


   
  
function appendUpdateForm(id){
	$.ajax({
		url: "php/getAll.php",
		type: 'POST',
		dataType: 'json',
		data: {		},
		success: function(result) {
			let data = result.data;
			for (let i= 0; i< data.length; i++){
			  let employeeID = data[i].id;
			  if (employeeID == id){
			  let firstName = data[i].firstName;
			  let lastName= data[i].lastName;
			  let job = data[i].jobTitle;
			  let email = data[i].email;
			  let department = data[i].department;
			  console.log(firstName,lastName,job,email)
			  $('#FirstName').val(firstName),
			  $('#LastName').val(lastName),
			  $('#JobTitle').val(job),
			  $('#Email').val(email),
		
			  getDropdowns($('#updateDepSelect'), departmentdb);
			  for(let i=0; i<departmentdb.length; i++){
				if(department == departmentdb[i].name){
				  $("#updateDepSelect").val(departmentdb[i].id);
				  break; 
				} 
			  }
			  }
			}
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
	$('#updateEmployeeConfirmBtn').on('click',
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

  function updateEmployeeClick(id) {
	$(`#edit${id}`).on('click', function() {
		appendUpdateForm(id);
		confirmUpdateEmployee(id);

	});


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
  
  function searchEmployee(){
let	departmentSelect = $('#departmentsel option:selected').val();	
let	locationSelect = $('#locationsel option:selected').val();
	let value = $('#name').val();
	if ((value) && (departmentSelect === 'placeholder') && (locationSelect === 'placeholder')) {
	 $.ajax({
	  url: "php/getEmployeeByName.php",
	  type: 'POST',
	  dataType: 'json', 
	  data:{
		value: value
	  },
	  success: function(result) {
		$('#records-card-list').html('');
		$('#count').html('');
		let data = result.data;
		$('#count').html(data.length);
		for (let i=0; i<data.length; i++){
		
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
		   
		 
			
	  },
	  error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR + textStatus+ errorThrown )
	  }
    	}); 
   
     }

	else if ((value) && (departmentSelect !== 'placeholder') && (locationSelect === 'placeholder')) {
		$.ajax({
		 url: "php/searchDepartment.php",
		 type: 'POST',
		 dataType: 'json', 
		 data:{
			value: value,
            id: departmentSelect
		   
		 },
		 success: function(result) {
		
		   $('#records-card-list').html('');
		   $('#count').html('');
		   let data = result.data;
		   $('#count').html(data.length);
		   for (let i=0; i<data.length; i++){
		   
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
			  
			
			   
		 },
		 error: function(jqXHR, textStatus, errorThrown) {
		   console.log(jqXHR + textStatus+ errorThrown )
		 }
		   }); 
	  
		}

		else if ((value) && (departmentSelect === 'placeholder') && (locationSelect !== 'placeholder')) {
			$.ajax({
			 url: "php/searchLocation.php",
			 type: 'POST',
			 dataType: 'json', 
			 data:{
				value: value,
				id: locationSelect
			   
			 },
			 success: function(result) {
			   $('#records-card-list').html('');
			   $('#count').html('');
			   let data = result.data;
			   $('#count').html(data.length);
			   for (let i=0; i<data.length; i++){
			   
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
				  
				
				   
			 },
			 error: function(jqXHR, textStatus, errorThrown) {
			   console.log(jqXHR + textStatus+ errorThrown )
			 }
			   }); 
		  
			}
			else if ((value) && (departmentSelect !== 'placeholder') && (locationSelect !== 'placeholder')) {
				$.ajax({
				 url: "php/searchBoth.php",
				 type: 'POST',
				 dataType: 'json', 
				 data:{
					value: value,
					locationId: locationSelect,
					departmentId: departmentSelect
				 },
				 success: function(result) {
				   $('#records-card-list').html('');
				   $('#count').html('');
				   let data = result.data;
				   $('#count').html(data.length);
				   for (let i=0; i<data.length; i++){
				   
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
					  
					
					   
				 },
				 error: function(jqXHR, textStatus, errorThrown) {
				   console.log(jqXHR + textStatus+ errorThrown )
				 }
				   }); 
			  
				}

				else if ((!value) && (departmentSelect !== 'placeholder') && (locationSelect === 'placeholder')) {
					$.ajax({
					 url: "php/searchDepartmentOnly.php",
					 type: 'POST',
					 dataType: 'json', 
					 data:{
						value: value,
						locationId: locationSelect,
						departmentId: departmentSelect
					 },
					 success: function(result) {
					   $('#records-card-list').html('');
					   $('#count').html('');
					   let data = result.data;
					   $('#count').html(data.length);
					   for (let i=0; i<data.length; i++){
					   
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
						  
						
						   
					 },
					 error: function(jqXHR, textStatus, errorThrown) {
					   console.log(jqXHR + textStatus+ errorThrown )
					 }
					   }); 
				  
					}

					else if ((!value) && (departmentSelect === 'placeholder') && (locationSelect !== 'placeholder')) {
						$.ajax({
						 url: "php/searchLocationOnly.php",
						 type: 'POST',
						 dataType: 'json', 
						 data:{
							value: value,
							locationId: locationSelect,
							departmentId: departmentSelect
						 },
						 success: function(result) {
						   $('#records-card-list').html('');
						   $('#count').html('');
						   let data = result.data;
						   $('#count').html(data.length);
						   for (let i=0; i<data.length; i++){
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
							  
							
							   
						 },
						 error: function(jqXHR, textStatus, errorThrown) {
						   console.log(jqXHR + textStatus+ errorThrown )
						 }
						   }); 
					  
						}
						else {
							getEmployees();
						  }
					

   }

   $(document).ready(function () {
	$("#loader").fadeOut("slow");
     main()
  });
