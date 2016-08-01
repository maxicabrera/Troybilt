function validatePR (form){
	var errors = "";
	if (form.firstName.value == ''){
		errors += "First name is required<br/>";
	}
	
	if (form.lastName.value == ''){
		errors += "Last Name is required<br/>";
	}
	
	if (form.address1.value == ''){
		errors +="Address is required<br/>";
	}

	if (form.city.value == ''){
		errors +="City is required<br/>";
	}	

	if (form.state.value == 'empty'){
		errors +="State is required<br/>";
	}	

	if (form.postalCode.value == ''){
		errors +="Zip Code is required<br/>";
	}		
	
	if (!validPhone(form.phoneNumber1.value + form.phoneNumber2.value + form.phoneNumber3.value)){
		errors +="Missing or invalid phone number <br/>";
	}
	else{ 
		form.phoneNumber.value = "" + form.phoneNumber1.value + "-" + form.phoneNumber2.value + "-" + form.phoneNumber3.value;
	}
	if(_storeId != '40001'){
		if (form.emailAddress.value == ''){
			errors +="Email address is required<br/>";
		}
	}

	if (form.purchased_from.value == ''){
		errors +="Purchased From is required<br/>";
	}
	
	form.purchasedDate.value = form.purchasedDateMonth.value + "/" + form.purchasedDateDay.value  + "/" +  form.purchasedDateYear.value;
	
	if (form.productType.value == ''){
		errors +="Product Type is required<br/>";
	}
	
	if (form.factoryNumber.value == ''){
		errors +="Factory number is required<br/>";
	}
	if (form.serialNumber.value == ''){
		errors +="Serial number is required<br/>";
	}
	if (form.endUse.value == ''){
		errors +="End Use is required<br/>";
	}
	if (form.under14.checked){
		errors +="To register a product on troybilt.ca you must be 14 years of age or older.<br/>";
	}
	if (!form.info_collection.checked){
		errors +="Troy Bilt will not be able to register your products after purchase or contact you directly in the unlikely event of product recall since your personal contact information will not be stored.<br/>";
	}
	
	
	
	
	
	//
	
	return errors;

}

function validPhone (phone){
	if (phone.length != 10){
		return false;
	}
	
	if (!Number(phone)){
		return false;
	}
	
	return true;
}