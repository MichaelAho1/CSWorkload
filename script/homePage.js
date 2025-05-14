async function getEstimatedSalary(job, location) {
    const jobTitleSplit = job.split(" "); //Splitting up words by spaces for the API call
    const locationSplit = location.split(" ");
    const url = `https://jsearch.p.rapidapi.com/estimated-salary?job_title=${jobTitleSplit[0]}%20${jobTitleSplit[1]}&location=${locationSplit[0]}%20${locationSplit[1]}&location_type=ANY&years_of_experience=LESS_THAN_ONE`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'ddb3fcec53msh88e103a07bcb32cp1ccf2bjsn9ecc01b01498',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    };
  
    const response = await fetch(url, options);
    const result = await response.json();  
    const data = result.data[0];
    return data;
}
  
async function handleLocationClick(element, job, location) { 
  const dropdown = element.closest('.dropdown'); //Gets the closest dropdown to that element(to get the location)
  const button = dropdown.querySelector('button');
  button.textContent = location; //Sets the dropdowns button to the location when clicked
  
  const data = await getEstimatedSalary(job, location);
  let max_salary = Math.round(data.max_salary / 1000) * 1000; //Get the max salary and round to nearest 1000
  let min_salary = Math.round(data.min_salary / 1000) * 1000;
  let jobTitle = job.split(" "); // Jobtitle[0] = the id of the average salary span element 
  
  document.getElementById(jobTitle[0]).textContent = `$${min_salary} - $${max_salary}`; //Displays the average salary as a range 
  
}
  
  