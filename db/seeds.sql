USE challenge;

INSERT INTO `challenge`.`Users` (`id`, `name`, `password`, `alias`, `email`, `email_verified`, `createdAt`, `updatedAt`) VALUES (NULL, 'testuser2', '$2a$10$KV6qPn/yM/ppvYzJqCG4y.DdkuRTdO4VPYcwwg.VROB4V5hAKANXG', NULL, 'pat2382@yahoo.com', '1', '', '');

INSERT INTO `challenge`.`Users` (`id`, `name`, `password`, `alias`, `email`, `email_verified`, `createdAt`, `updatedAt`) VALUES (NULL, 'testuser', '$2a$10$WiXE0YZF.LJ7.lePA1t8..qy4ITCfkaGmqpg2369HZnuNcP/cNAvW', NULL, 'tim.jeng@gmail.com', '1', '', '');

INSERT INTO `challenge`.`Templates` (`id`, `name`, `rule`, `createdAt`, `updatedAt`) VALUES (NULL, 'test', 'rules aren''t there for a test', '', '');

INSERT INTO `challenge`.`Instances` (`challenge_id`, `challenger_proof`, `challenged_proof`, `state`, `createdAt`, `updatedAt`, `issuer_id`, `accepter_id`, `template_id`) VALUES (NULL, 'www.placehold.com', NULL, 'challenge-issued', '', '', '1', NULL, '1');

INSERT INTO `challenge`.`Instances` (`challenge_id`, `challenger_proof`, `challenged_proof`, `state`, `createdAt`, `updatedAt`, `issuer_id`, `accepter_id`, `template_id`) VALUES (NULL, 'www.placehold2.com', NULL, 'proof-accepted', '', '', '1', '1', '1');

INSERT INTO `challenge`.`Instances` (`challenge_id`, `challenger_proof`, `challenged_proof`, `state`, `createdAt`, `updatedAt`, `issuer_id`, `accepter_id`, `template_id`) VALUES (NULL, 'www.whocared.com', 'www.Icared.com', 'provided-proof', '', '', '1', '1', '1');
