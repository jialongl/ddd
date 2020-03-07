#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys, requests

friends = [
	632316101,
	326772738,
	535510724,
	523251500,
	222490977,
	210318497,
	626657117,
	335511778,
	414734555,
	332421834,
	426997987,
	325753994,
	527908836,
	812826327,
	131192040,
	110689464,
	107199920,
]
if len(sys.argv) == 3 and sys.argv[2] == 'test':
	friends = [friends[-1]]

for uid in friends:
	# sys.argv[1] is auto URL-encoded (%aa%bb%cc%..) by requests.get()
	response = requests.get(
		"http://statistics.pandadastudio.com/player/giftCode",
		params={'uid': uid, 'code': sys.argv[1]}
	)
	j = response.json()
	print(uid, j['msg'], j['code'], flush=True)

	# 417 礼包不存在
	# 424 礼包未到生效时间或已过期
	# 425 礼包已被领取
	if j['code'] == 424:
		break
