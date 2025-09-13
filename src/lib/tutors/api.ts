{/*Aboute Step*/}
export const createTutorAbout = async (data: any, token: string) => {
  const response = await fetch('http://localhost:8000/api/tutors/about', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    
    if (responseData.errors) {
      
      throw responseData.errors;
    } else {
      throw new Error(responseData.message || 'Failed to create tutor');
    }
  }

  return responseData;
};

{/*Picture Step*/}
export const uploadTutorPhoto = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('http://localhost:8000/api/tutors/photo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,

     
    },
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    if (responseData.errors) {
      throw responseData.errors; 
    } else {
      throw new Error(responseData.message || 'Failed to upload photo');
    }
  }

  return responseData; 
};

{/* Certification Step */}
export const storeTutorCertifications = async (certifications: any[], token: string) => {
  const formData = new FormData();

  certifications.forEach((cert, index) => {
    formData.append(`certifications[${index}][subject]`, cert.subject);
    formData.append(`certifications[${index}][certification]`, cert.certification);
    formData.append(`certifications[${index}][years_from]`, cert.yearsFrom);
    formData.append(`certifications[${index}][years_to]`, cert.yearsTo);
    if (cert.file) formData.append(`certifications[${index}][file]`, cert.file);
  });

  const response = await fetch('http://localhost:8000/api/tutors/certifications', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    if (responseData.errors) throw responseData.errors;
    else throw new Error(responseData.message || 'Failed to save certifications');
  }

  return responseData;
};