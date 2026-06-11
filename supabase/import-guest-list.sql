-- =========================================================================
-- Guest list import — generated from The Knot export (2026-06-09)
-- Paste into Supabase -> SQL Editor -> Run. RUN THIS ONLY ONCE on an empty
-- guest list: running it twice creates duplicates. (To start over:
--   delete from guests; delete from households;  then run this again.)
-- Mailing addresses are kept in each household's private notes.
-- =========================================================================

with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Carol Beattie & Mike Beattie', null, '+12813814708', '326 Lagrange Dr., Fredericksburg, TX 78624', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Carol Beattie', 'Mike Beattie']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Robin Beattie', 'robinb.0021@gmail.com', '+1 (281) 731-6464', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Robin Beattie']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jake Beattie & Lyndsi Beattie', null, '+12816364281', '372 Walnut Creek, New Braunfels, TX 78130', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jake Beattie', 'Lyndsi Beattie']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Cynthia Stevenson', null, null, '104 Bella Toscana Ave, Unit 2111, Lakeway, TX 78734', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Cynthia Stevenson']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Sharon Brydon', null, null, '50 Beethoven St, Binghamton, NY 13905', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Sharon Brydon']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Stanley Beattie', null, null, '41120 Fox Fun Rd, Apartment MG 507, Novi, MI 48337', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Stanley Beattie']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Martha Graham & Larry Graham', null, null, '185 Prospect Place, Brooklyn, NY 11238', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Martha Graham', 'Larry Graham']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Robert Beattie & Joan Beattie', null, null, '4577 Sperryville Pike, Woodville, VA 22746', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Robert Beattie', 'Joan Beattie']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('David Case & Fran Case', null, null, '1614 Teakwood, Wylie, TX 75098', false) returning id)
insert into guests (household_id, name) select id, unnest(array['David Case', 'Fran Case']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jeanne Case', null, null, '1607 Shady Grove Ct, Wylie, TX 75098', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jeanne Case']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Mark Case & Tatyana Case', null, null, '1609 Shady Grove Ct, Wylie, TX 75098', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Mark Case', 'Tatyana Case']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Chris Case & Jill Case', null, null, '1722 Teakwood, Wylie, TX 75098', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Chris Case', 'Jill Case']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jeff Kendrick & Lisa Kendrick', null, null, '3537 Meadowside, Sachse, TX 75048', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jeff Kendrick', 'Lisa Kendrick']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Craig Case', null, null, '1611 Thornberry Dr, Wylie, TX 75098', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Craig Case']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Eric Koch & Stephanie Koch', null, null, '2128 Highland Dr, Wylie, TX 75098', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Eric Koch', 'Stephanie Koch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jordan Stone & Haley Stone', null, null, '916 Community Way, Josephine, TX 75189', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jordan Stone', 'Haley Stone']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Meg Christensen & Cecil Christensen', null, null, '3996 Lupine Dr, Unit A, Vail, CO 81657', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Meg Christensen', 'Cecil Christensen']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('John Pallante & Naomi Pallante', null, null, '4990 S. Elizabeth Ln, Evergreen, CO 80439', false) returning id)
insert into guests (household_id, name) select id, unnest(array['John Pallante', 'Naomi Pallante']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jamie Graham', null, null, '185 Prospect Place, Brooklyn, NY 11238', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Jamie Graham']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Christopher Graham & Lisa Graham', null, null, '10 Highfield Terrace, Caldwell, NJ 07006', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Christopher Graham', 'Lisa Graham']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Peter Graham', null, null, '24 Crafts Ave, Apt 1, Northampton, MA 01060', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Peter Graham']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Janet Lippert & Tony Lippert', null, null, '1000 Overhill Rd, Manhattan, KS 66503', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Janet Lippert', 'Tony Lippert']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Julie Johnson', null, null, '124 Fairway Ridge Dr, Chapin, SC 29036', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Julie Johnson']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Collette Siemrzuch & Rich Siemrzuch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Collette Siemrzuch', 'Rich Siemrzuch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Ted Henderson & Betty Henderson', null, null, '4622 225th Ave SE, Sammamish, WA 98075', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Ted Henderson', 'Betty Henderson']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Clay Holloway & Janet Holloway', null, null, '9674 East Shore Dr, Willis, TX 77318', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Clay Holloway', 'Janet Holloway']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Eric Green & Susan Green', null, null, '2902 Forest View, Richmond, TX 77406', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Eric Green', 'Susan Green']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Ed Katterhagen & Rhonda Katterhagen', null, null, '30 W Fairbranch Circle, The Woodlands, TX 77382', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Ed Katterhagen', 'Rhonda Katterhagen']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Lauren Katterhagen', null, null, '428 Gryffindor Dr, Phoenixville, PA 19460', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Lauren Katterhagen']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Spencer Katterhagen & Sophia Bullard', null, null, '2101 11th St NW, Apt 205, Washington, DC 20001', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Spencer Katterhagen', 'Sophia Bullard']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Scott Gustafson & Katie Gustafson', null, null, '38 N. Greenvine Circle, The Woodlands, TX 77382', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Scott Gustafson', 'Katie Gustafson']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Sandy McGinley & Ingrid McGinley', null, null, '50 N. Greenvine Circle, The Woodlands, TX 77382', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Sandy McGinley', 'Ingrid McGinley']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jillian Katterhagen & Mark Denin', null, '+12816604178', '2216 11th St NW, #4, Washington, DC 20001', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jillian Katterhagen', 'Mark Denin']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Claire Landsbaum & Laurel Landsbaum', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Claire Landsbaum', 'Laurel Landsbaum']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Lauren Russell & Taylor Russell', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Lauren Russell', 'Taylor Russell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Justin Tarlton', null, '+17042423566', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Justin Tarlton']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jenna Penticoff & Josie Falkum', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jenna Penticoff', 'Josie Falkum']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Rachel Galey & Brennan Galey', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Rachel Galey', 'Brennan Galey']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Chelsie Liberati & Matt Liberati', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Chelsie Liberati', 'Matt Liberati']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Allie Schultz & Eric Ugland', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Allie Schultz', 'Eric Ugland']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Tayler Aitken', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Tayler Aitken']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Madi Speer & Jordan Ginzl', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Madi Speer', 'Jordan Ginzl']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Sandra Gonzalez', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Sandra Gonzalez']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Morgan Youskevetch & Pat Youskevetch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Morgan Youskevetch', 'Pat Youskevetch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Mike Essien & Nimi Essien', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Mike Essien', 'Nimi Essien']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Samantha Moreno', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Samantha Moreno']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jessyka Ortega', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Jessyka Ortega']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Mary Delaware & Jamie Delaware', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Mary Delaware', 'Jamie Delaware']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Aubrey Thompson & Charlie Thompson', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Aubrey Thompson', 'Charlie Thompson']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Cleo Ledet & David Ledet', null, '+17206356611', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Cleo Ledet', 'David Ledet']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Laura Thompson & Ryan Thompson', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Laura Thompson', 'Ryan Thompson']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Hunter Coleman & Kenny Coleman', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Hunter Coleman', 'Kenny Coleman']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Amy Ackermann & Joey Ackermann', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Amy Ackermann', 'Joey Ackermann']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Sammy Smith', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Sammy Smith']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Parker Sheley & Ben Sheley', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Parker Sheley', 'Ben Sheley']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Liz Lovasco & Paul Lovasco', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Liz Lovasco', 'Paul Lovasco']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Susan Gell-Horton', 'gellhorton@gmail.com', null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Susan Gell-Horton']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Matthew Horton', null, '(214) 557-5341', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Matthew Horton']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Caryl Horton & Dale Horton', null, '402-517-7507', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Caryl Horton', 'Dale Horton']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Tim Horton & Shelli Horton', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Tim Horton', 'Shelli Horton']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Grant Horton', null, '+14025369116', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Grant Horton']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Evan Horton', null, '(402) 889-1001', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Evan Horton']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Cathy Murphy', null, '6508672345', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Cathy Murphy']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Kaitlin Murphy', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Kaitlin Murphy']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Ryan Murphy', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Ryan Murphy']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Steve Evers & Susie Evers', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Steve Evers', 'Susie Evers']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jamie Evers & Elizabeth Evers', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jamie Evers', 'Elizabeth Evers']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Cassie Jetter', null, '+14022132277', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Cassie Jetter']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jerry Evers', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jerry Evers']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Larry Evers & Sheila Evers', null, '+14024172091', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Larry Evers', 'Sheila Evers']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Ashley Evers & Curtis', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Ashley Evers', 'Curtis']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Derek Evers', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Derek Evers']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('John Gell & Lisa Gell', null, '+1 (402) 850-6653', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['John Gell', 'Lisa Gell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jack Gell', null, '+14027407810', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Jack Gell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Maggie Goodhard & Jason Goodhard', null, '(402) 980-8607', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Maggie Goodhard', 'Jason Goodhard']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Patrick Gell', null, '+14027407961', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Patrick Gell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Tom Gell & Karen Gell', null, '+19136260114', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Tom Gell', 'Karen Gell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Bailey Gell & Kirill Gell', null, '+19136200820', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Bailey Gell', 'Kirill Gell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Brady Gell & Jasmine Gell', null, '+1 (913) 620-2142', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Brady Gell', 'Jasmine Gell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Brock Gell', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Brock Gell']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Anne Severes & Ian Severes', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Anne Severes', 'Ian Severes']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Sarah Severes & John Paul Severes', null, '+14029951458', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Sarah Severes', 'John Paul Severes']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jennifer Roberts & Shane Roberts', null, '+14022103809', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jennifer Roberts', 'Shane Roberts']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Patrick Roberts & Bailey Roberts', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Patrick Roberts', 'Bailey Roberts']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Mike Brown & Elizabeth Brown', 'miketbrown@verizon.net', '(972) 355-9989', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Mike Brown', 'Elizabeth Brown']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Pete Michalski & Kelley Michalski', null, '+14698676519', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Pete Michalski', 'Kelley Michalski']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Riley Michalski & Allie Michalski', null, '+19728040139', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Riley Michalski', 'Allie Michalski']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Cooper Michalski', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Cooper Michalski']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Reid Michalski', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Reid Michalski']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Steven Johnson & Stacie Johnson', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Steven Johnson', 'Stacie Johnson']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jeff Rarick & Dana Rarick', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jeff Rarick', 'Dana Rarick']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Anthony Bussanaich & Nikki Ann Bussanaich', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Anthony Bussanaich', 'Nikki Ann Bussanaich']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Suman Upreti & Conchita Upreti', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Suman Upreti', 'Conchita Upreti']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jeff Arellano & Michelle Arellano', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Jeff Arellano', 'Michelle Arellano']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Martha Wikert', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Martha Wikert']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('William Lynch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['William Lynch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Katie Lynch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Katie Lynch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Michael Lynch & Maria Lynch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Michael Lynch', 'Maria Lynch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Daniel Lynch & Kimberly Lynch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Daniel Lynch', 'Kimberly Lynch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Charles Lynch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Charles Lynch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Peter Lynch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Peter Lynch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Steve Lynch & Molly Lynch', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Steve Lynch', 'Molly Lynch']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Ryan Dockman & Abbey Dockman', null, '+12165443011', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Ryan Dockman', 'Abbey Dockman']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Noah Newman', null, '+18476243312', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Noah Newman']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Ally Goldsmith', null, '+18153424446', '3017 w Logan blvd unit 2', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Ally Goldsmith']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Alex Urrutia', null, '+12145770185', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Alex Urrutia']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Max Ary', null, '(214) 668-9638', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Max Ary']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Peter Mungigurra & Bailey Mungigurra', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Peter Mungigurra', 'Bailey Mungigurra']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Henrick Zetterstrom & Kamryn Zetterstrom', null, '+1 (806) 778-9388', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Henrick Zetterstrom', 'Kamryn Zetterstrom']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Nick Ramirez', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Nick Ramirez']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Nathan Houk', null, '+1 (469) 647-1491', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Nathan Houk']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Zach Ruther', null, '+1 (972) 953-5212', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Zach Ruther']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Stephanie Szlosek', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Stephanie Szlosek']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Riley Appleyard', 'riley.appleyard@icloud.com', '(405) 315-7311', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Riley Appleyard']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Thomas Borgman', null, null, '4545 Mission Ave, Frisco, Texas 75034', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Thomas Borgman']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Thomas Whittington', null, '(972) 922-8186', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Thomas Whittington']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Ali Lewis', null, '+1 (214) 557-4010', '10101 Metropolitan Dr, Apt 267, Austin, TX 78758', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Ali Lewis']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Claire Scribner & Austin Scribner', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Claire Scribner', 'Austin Scribner']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Miranda Raiford', null, '+1 (516) 424-7346', '714 W Buckingham PL APT 2E, Chicago, IL 60657', true) returning id)
insert into guests (household_id, name) select id, unnest(array['Miranda Raiford']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Jaidan Cook', null, '+16142264748', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Jaidan Cook']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Danny Lesh & Amaya Lesh', null, '+18189149204', '6 S Laflin St, APT 714, Chicago IL, 60607', false) returning id)
insert into guests (household_id, name) select id, unnest(array['Danny Lesh', 'Amaya Lesh']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Callie Cowart', null, '+12144998736', null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Callie Cowart']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Karan Gupta & Maeve Gupta', 'guptak3@miamioh.edu', '+15135933430', null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Karan Gupta', 'Maeve Gupta']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Douglas DuBois II', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Douglas DuBois II']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Sanchit Ram Arvind', null, null, null, true) returning id)
insert into guests (household_id, name) select id, unnest(array['Sanchit Ram Arvind']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('Erika Potasky & Diego Potasky', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['Erika Potasky', 'Diego Potasky']) from hh;
with hh as (insert into households (name, email, phone, notes, plus_one_allowed) values ('JZ Zimbelman & Megan Zimbelman', null, null, null, false) returning id)
insert into guests (household_id, name) select id, unnest(array['JZ Zimbelman', 'Megan Zimbelman']) from hh;
