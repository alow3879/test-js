const getUsersBtn = document.querySelector('.get-users')
const statistics = document.querySelector('.statistics')
const loader = document.querySelector('.loader')
const errorBlock = document.querySelector('.error')
const cards = document.querySelector('.cards')

let mostGenderArr = ['Больше мужчин', 'Мужчин и женщин поровну', 'Больше женщин']

let statsData = {
	total: 0,
	genders: {
		male: 0,
		female: 0
	},
	most: mostGenderArr,
	nationality: {}
}

getUsersBtn.addEventListener('click', getUsers)

async function getUsers() {
	await toggleLoader()
	
	try {
		await fetch(`https://randomuser.me/api/?results=${Math.floor(Math.random() * 100)}`)
			.then(response => response.json())
			.then(response => renderCards(response.results))
			.then(response => calcStatistics(response))
			.then(response => renderStatistics(response))
	}
	catch (e) { error(e) }
	
	await toggleLoader()
}

function error(e) {
	errorBlock.innerHTML = `Упс, при загрузке данных что-то пошло не так :( ${e}`
	toggleVisibleError()
}

function toggleVisibleError() {
	errorBlock.classList.toggle('error_active')
	setTimeout(toggleVisibleError, 4000)
}

function toggleLoader() {
	loader.classList.toggle('loader_active')
}

function renderCards(response) {
	let template = ''
	response.forEach((item) => {
		template += 
			`<div class="card-wrapper">
				<div class="card">
					<div>
						<img src="${item.picture.large}" alt="">
					</div>
					<div>${item.name.title} ${item.name.first} ${item.name.last}</div>
					<div>${item.gender}</div>
					<div>
						<a href="tel:${item.phone}">${item.phone}</a>
					</div>
					<div>
						<a href="mailto:${item.email}">${item.email}</a>
					</div>
					<div>
						<span>${item.location.state},</span>
						<span>${item.location.city},</span>
						<span>${item.location.street.name} /</span>
						<span>${item.location.street.number}</span>
					</div>
					<div>Дата рождения: ${item.dob.date.substring(0, 10)}</div>
					<div>Дата регистрации: ${item.registered.date.substring(0, 10)}</div>
				</div>
			</div>`
	})
	cards.innerHTML = template
	return response
}

function calcStatistics(response) {
	statsData.total += response.length
	
	response.forEach((item) => {
		statsData.genders[item.gender]++

		if (!statsData.nationality.hasOwnProperty(item.nat)) {
			statsData.nationality[item.nat] = 1
		} else {
			statsData.nationality[item.nat]++
		}
	})

	return response
}

function mostGender() {
	if (statsData.genders.male > statsData.genders.female) {
		return statsData.most[0]
	} else if (statsData.genders.male === statsData.genders.female) {
		return statsData.most[1]
	} else {
		return statsData.most[2]
	}
}

function renderStatistics(response) {
	let template = `<div>Всего: ${statsData.total}</div>
									<div>
										<span>Мужчин: ${statsData.genders.male}</span> |
										<span>Женщин: ${statsData.genders.female}</span>
									</div>
									<div>${mostGender()}</div>
									<div>
										<ol>${renderNationality(statsData.nationality)}</ol>
									</div>`
	statistics.innerHTML = template
}


function renderNationality(nationality) {
	let template = ''
	for (const item in nationality) {
		template += `<li>${item} - ${nationality[item]}</li>`
	}
	return template
}