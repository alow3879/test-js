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
	catch (e) { 
		error(e) 
	}
	
	await toggleLoader()
}

function error(e) {
	errorBlock.innerHTML = `Упс, при загрузке данных что-то пошло не так :( ${e}`
	toggleVisibleError()
	setTimeout(toggleVisibleError, 4000)
}

function toggleVisibleError() {
	errorBlock.classList.toggle('error_active')
}

function toggleLoader() {
	loader.classList.toggle('loader_active')
}

function renderCards(response) {
	let clonesArr = []
	const template = document.querySelector('#card-template').content.children[0]

	response.forEach((item) => {
		const card = document.importNode(template, true)
		
		card.querySelector('.card__img').attributes.src.value = item.picture.large
		card.querySelector('.card__name').textContent = `${item.name.title} ${item.name.first} ${item.name.last}`
		card.querySelector('.card__gender').textContent = item.gender
		card.querySelector('.card__tel').attributes.href.value = `tel:${item.phone}`
		card.querySelector('.card__tel').textContent = item.phone
		card.querySelector('.card__email').attributes.href.value = `tel:${item.emial}`
		card.querySelector('.card__email').textContent = item.email
		card.querySelector('.card__address').textContent = `${item.location.state}, ${item.location.city}, ${item.location.street.name} / ${item.location.street.number}`
		card.querySelector('.card__birthday').textContent = `Дата рождения: ${item.dob.date.substring(0, 10)}`
		card.querySelector('.card__date-reg').textContent = `Дата регистрации: ${item.registered.date.substring(0, 10)}`
		
		cards.appendChild(card)
	})
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
	const template = document.querySelector('#statistics-template').content
	const clone = document.importNode(template, true)

	clone.querySelector('.statistics__total').textContent = `Всего: ${statsData.total}`
	clone.querySelector('.statistics__genders').textContent = `Мужчин: ${statsData.genders.male} | Женщин: ${statsData.genders.female}`
	clone.querySelector('.statistics__most-gender').textContent = mostGender()
	clone.querySelector('.statistics__nationality').innerHTML = renderNationality(statsData.nationality)
	
	statistics.innerText = ''
	statistics.appendChild(clone)
}

function renderNationality(nationality) {
	let template = ''
	for (const item in nationality) {
		template += `<li>${item} - ${nationality[item]}</li>`
	}
	return template
}