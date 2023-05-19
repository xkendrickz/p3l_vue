<template>
	<main class="main-content  mt-0">
		<section>
			<div class="page-header min-vh-100">
				<div class="container">
					<div class="row">
						<div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto">
							<div class="card card-plain">
								<div class="card-header pb-0 text-start">
									<h4 class="font-weight-bolder">Sign In</h4>
									<p class="mb-0">Enter your email and password to sign in</p>
								</div>
								<div class="card-body">
									<form class="p-3 mt-3" @submit.prevent="login">
										<div class="form-group">
											<v-text-field v-model="pegawai.username" label="Username"
												variant="underlined"></v-text-field>
											<div v-if="validation.username" class="mt-2 alert alert-danger">
												{{ validation.username[0] }}
											</div>
											<v-text-field v-model="pegawai.password" label="Password"
												variant="underlined"></v-text-field>
											<div v-if="validation.password" class="mt-2 alert alert-danger">
												{{ validation.password[0] }}
											</div>
											<v-btn type="submit" block rounded="xl" color="blue">LOGIN</v-btn>
										</div>
									</form>
								</div>
							</div>
						</div>
						<div
							class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column">
							<div class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
								style="background-image: linear-gradient(rgba(40, 40, 40, 0.6), rgba(40, 40, 40, 0.8)), url('https://i.pinimg.com/736x/f7/4f/5a/f74f5a4cbbf2582549d09858c3088dbd.jpg'); background-size: cover;">
								<span class="mask bg-gradient-primary"></span>
								<h3 class="mt-5 text-white font-weight-bolder position-relative">"Pake Nanya"</h3>
								<p class="text-white position-relative">- Ahmad Tukam</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import { onMounted } from 'vue';
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from "vue-toastification";
export default {
	created() {
		document.title = 'Login';
	},
	setup() {

		//inisialisasi vue router on Composition API
		const router = useRouter()

		//state user
		const pegawai = reactive({
			username: '',
			password: '',
		})

		//state validation
		const validation = ref([])

		//state loginFailed
		const loginFailed = ref(null)
		let toast = useToast();

		const errors = reactive({
			usernameErrors: '',
			passwordErrors: '',
		})

		onMounted(() => {
			// axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
			window.history.pushState(null, null, window.location.href);
			window.onpopstate = function () {
				window.history.pushState(null, null, window.location.href);
			};
		})

		//method login
		function login() {
			//send server with axios
			let username = pegawai.username
			let password = pegawai.password
			axios
				.get('http://192.168.1.24/Server_Go_Fit/public/pegawai/' + username + "/" + password)
				.then((response) => {

					if (response && response.data && response.data.data) {
						toast.success("Berhasil Login !", {
							timeout: 2000
						})
						let data = response.data.data; // Access 'data' field in response

						// Check if 'data' is an object
						let role = data.id_role;

						if (role == 1) {
							router.push('admin');
						} else if (role == 2) {
							router.push('mo');
						} else if (role == 3) {
							router.push('kasir');
						}
					}

					//redirect ke halaman dashboard
					// else if (response.data.user.id !== 1) {
					// router
					//     .push({
					//     name: "user.produk.index",
					//     })
					// }

					//set state loggedIn to true
				})
				.catch((error) => {
					errors.usernameErrors = 'Pegawai not found';
					errors.passwordErrors = 'Pegawai not found';
					console.error(error);
				});
		}

		return {
			pegawai,           // <-- state user
			validation,     // <-- state validation 
			loginFailed,    // <-- state loggedIn
			login           // <-- method login
		}

	}

}
</script>

<style>
.background-image {
	background-color: rgba(52, 58, 64, 0.5);
}

/* Importing fonts from Google */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Reseting */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Poppins', sans-serif;
}

body {
	background: #ecf0f3;
	/* background-image: url("https://media.tenor.com/0weeqPoyCWIAAAAd/how-heavy-are-the-dumbbells-that-you-lift-dumbbell-nan-kilo-moteru.gif");
        background-size:100% */
}

.wrapper {
	max-width: 350px;
	min-height: 500px;
	margin: 80px auto;
	padding: 40px 30px 30px 30px;
	background-color: #ecf0f3;
	border-radius: 15px;
	box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
}

.logo {
	width: 80px;
	margin: auto;
}

.logo img {
	width: 100%;
	height: 80px;
	object-fit: cover;
	border-radius: 50%;
	box-shadow: 0px 0px 3px #5f5f5f,
		0px 0px 0px 5px #ecf0f3,
		8px 8px 15px #a7aaa7,
		-8px -8px 15px #fff;
}

.wrapper .name {
	font-weight: 600;
	font-size: 1.4rem;
	letter-spacing: 1.3px;
	padding-left: 10px;
	color: #555;
}

.wrapper .form-field input {
	width: 100%;
	display: block;
	border: none;
	outline: none;
	background: none;
	font-size: 1.2rem;
	color: #666;
	padding: 10px 15px 10px 10px;
	/* border: 1px solid red; */
}

.wrapper .form-field {
	padding-left: 10px;
	margin-bottom: 20px;
	border-radius: 20px;
	box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
}

.wrapper .form-field .fas {
	color: #555;
}

.wrapper .btn {
	box-shadow: none;
	width: 100%;
	height: 40px;
	background-color: #03A9F4;
	color: #fff;
	border-radius: 25px;
	box-shadow: 3px 3px 3px #b1b1b1,
		-3px -3px 3px #fff;
	letter-spacing: 1.3px;
}

.wrapper .btn:hover {
	background-color: #039BE5;
}

.wrapper a {
	text-decoration: none;
	font-size: 0.8rem;
	color: #03A9F4;
}

.wrapper a:hover {
	color: #039BE5;
}

@media(max-width: 380px) {
	.wrapper {
		margin: 30px 20px;
		padding: 40px 15px 15px 15px;
	}
}
</style>