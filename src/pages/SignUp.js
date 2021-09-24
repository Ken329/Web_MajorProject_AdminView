import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

function SignUp() {
    let history = useHistory();
    const [isProfileSaved, setIsProfileSaved] = useState(false);
    const [isPersonalSaved, setIsPersonalSaved] = useState(false);

    function getProfile(e){
        if(isProfileSaved){
            document.getElementById('profile').elements["company-website"].disabled = false;
            document.getElementById('profile').elements["restaurant-name"].disabled = false;
            document.getElementById('profile').elements["price_range"].disabled = false;
            document.getElementById('profile').elements["cuisine"].disabled = false;
            setIsProfileSaved(false)
            document.getElementById("profile-btn").innerHTML = "Save";
            return;
        }
        var picture = document.getElementById('profile').elements["company-website"].value;
        var name = document.getElementById('profile').elements["restaurant-name"].value;
        var range = document.getElementById('profile').elements["price_range"].value;
        var cuisine = document.getElementById('profile').elements["cuisine"].value;
    
        if(isNull(picture) && isNull(name) && isNull(range) && isNull(cuisine)){
            document.getElementById('profile').elements["company-website"].disabled = true;
            document.getElementById('profile').elements["restaurant-name"].disabled = true;
            document.getElementById('profile').elements["price_range"].disabled = true;
            document.getElementById('profile').elements["cuisine"].disabled = true;
            setIsProfileSaved(true)
            document.getElementById("profile-btn").innerHTML = "Saved";
        }else{
            alert("Please fill in all the required field")
        }
    }
    function getPersonal(e){
        if(isPersonalSaved){
            document.getElementById('personal').elements["first-name"].disabled = false;
            document.getElementById('personal').elements["last-name"].disabled = false;
            document.getElementById('personal').elements["email-address"].disabled = false;
            document.getElementById('personal').elements["gender"].disabled = false;
            document.getElementById('personal').elements["country"].disabled = false;
            document.getElementById('personal').elements["street-address"].disabled = false;
            document.getElementById('personal').elements["city"].disabled = false;
            document.getElementById('personal').elements["postal-code"].disabled = false;
            setIsPersonalSaved(false)
            document.getElementById("personal-btn").innerHTML = "Save";
            return;
        }
        var firstName = document.getElementById('personal').elements["first-name"].value;
        var lastName = document.getElementById('personal').elements["last-name"].value;
        var email = document.getElementById('personal').elements["email-address"].value;
        var gender = document.getElementById('personal').elements["gender"].value;
        var state = document.getElementById('personal').elements["country"].value;
        var address = document.getElementById('personal').elements["street-address"].value;
        var city = document.getElementById('personal').elements["city"].value;
        var postalCode = document.getElementById('personal').elements["postal-code"].value;

        if(isNull(firstName)&&isNull(lastName)&&isNull(email)&&isNull(gender)&&isNull(state)&&isNull(state)&&isNull(address)
        &&isNull(city)&&isNull(postalCode)){
          if(validateEmail(email)){
            document.getElementById('personal').elements["first-name"].disabled = true;
            document.getElementById('personal').elements["last-name"].disabled = true;
            document.getElementById('personal').elements["email-address"].disabled = true;
            document.getElementById('personal').elements["gender"].disabled = true;
            document.getElementById('personal').elements["country"].disabled = true;
            document.getElementById('personal').elements["street-address"].disabled = true;
            document.getElementById('personal').elements["city"].disabled = true;
            document.getElementById('personal').elements["postal-code"].disabled = true;
            setIsPersonalSaved(true)
            document.getElementById("personal-btn").innerHTML = "Saved";
          }
        }else{
            alert("Please fill in all the required field")
        }
    }
    function getAccount(e){
        if(isPersonalSaved && isProfileSaved){
            var password = document.getElementById("account").elements["password"].value;
            var confirmPassword = document.getElementById("account").elements["confirm_password"].value;
            if(password === confirmPassword){
              var picture = document.getElementById('profile').elements["company-website"].value;
              var name = document.getElementById('profile').elements["restaurant-name"].value;
              var range = document.getElementById('profile').elements["price_range"].value;
              var cuisine = document.getElementById('profile').elements["cuisine"].value;
              var firstName = document.getElementById('personal').elements["first-name"].value;
              var lastName = document.getElementById('personal').elements["last-name"].value;
              var email = document.getElementById('personal').elements["email-address"].value;
              var gender = document.getElementById('personal').elements["gender"].value;
              var state = document.getElementById('personal').elements["country"].value;
              var address = document.getElementById('personal').elements["street-address"].value;
              var city = document.getElementById('personal').elements["city"].value;
              var postalCode = document.getElementById('personal').elements["postal-code"].value;

              Axios.post('https://eatsy-0329.herokuapp.com/addAdmin', {
                email: email,
                password: password,
                restaurant: name,
                cuisine: cuisine,
                image: picture,
                priceRange: range,
                lastName: lastName,
                firstName: firstName,
                gender: gender,
                state: state,
                address: address,
                city: city,
                postalCode: postalCode,
              })
              .then((res) => {
                alert(res.data.data.message);
                if(res.data.data.success){
                  history.push('/Login');
                }
              })
            }else{
              alert("Password is not the same, please check");
            }
        }else{
            alert("Please save both form above before submitting")
        }
    }

    // personal used function
    function isNull(data){
        if(data === ""){
            return false
        }
        return true;
    }
    function validateEmail(mail){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
          return (true);
        }
        alert("You have entered an invalid email address!");
        return (false);
    }
    useEffect( () => {
        
    }, [] )
    return (
      <>
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4">
                <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900">Profile</h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form id="profile" method="POST">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-3">
                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                          Cover Photo
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            http://
                          </span>
                          <input
                            type="text"
                            name="company-website"
                            id="company-website"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 px-2"
                            placeholder="www.example.com"
                          />
                        </div>
                      </div>

                      <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          name="restaurant-name"
                          id="restaurant-name"
                          autoComplete="family-name"
                          className="mt-1 py-2 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">
                          Price range
                        </label>
                        <select
                          id="price_range"
                          name="price_range"
                          autoComplete="Price Range"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                        </select>
                      </div>

                      <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                          Restaurant Cuisine
                        </label>
                        <select
                          id="cuisine"
                          name="cuisine"
                          autoComplete="cuisine"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option>Chinese</option>
                          <option>Indian</option>
                          <option>Malay</option>
                          <option>Eastern</option>
                          <option>Japanese</option>
                          <option>Korean</option>
                        </select>
                      </div>

                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                        onClick={e => getProfile(e)}
                        type="button"
                        id="profile-btn"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
  
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
  
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form id="personal" method="POST">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
  
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
  
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <input
                          type="text"
                          name="email-address"
                          id="email-address"
                          autoComplete="email"
                          className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
  
                      <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          autoComplete="gender"
                          className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option>Mr.</option>
                          <option>Ms.</option>
                          <option>Others</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <select
                          id="country"
                          name="country"
                          autoComplete="country"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option>Selangor</option>
                          <option>Johor</option>
                          <option>Kuala Lumpur</option>
                          <option>Kedah</option>
                          <option>Kelantan</option>
                          <option>Malacca</option>
                          <option>Negeri Sembilan</option>
                          <option>Pahang</option>
                          <option>Penang</option>
                          <option>Perak</option>
                          <option>Sabah</option>
                          <option>Sarawak</option>
                          <option>Terengganu</option>
                          <option>Labuan</option>
                          <option>Putrajaya</option>
                        </select>
                      </div>
  
                      <div className="col-span-6">
                        <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                          Street address
                        </label>
                        <input
                          type="text"
                          name="street-address"
                          id="street-address"
                          autoComplete="street-address"
                          className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
  
                      <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
  
                      <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                          ZIP / Postal
                        </label>
                        <input
                          type="text"
                          name="postal-code"
                          id="postal-code"
                          autoComplete="postal-code"
                          className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={e => getPersonal(e)}
                      type="button"
                      id="personal-btn"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
  
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
  
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Account Setup</h3>
                <p className="mt-1 text-sm text-gray-600">To protect your restaurant information and so.</p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form id="account" method="POST">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                        Password
                        </label>
                        <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="password"
                        className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                      
                    <div className="col-span-3 sm:col-span-1">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                        </label>
                        <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        autoComplete="password"
                        className="mt-1 py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={e => getAccount(e)}
                      type="button"
                      id="account-btn"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
}
export default SignUp
  